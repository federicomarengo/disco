'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, Send, Heart } from 'lucide-react'
import { mockProfiles } from '@/lib/profiles'

const MOCK_CHAT = [
  { from: 'them', text: '¡Hola! Vi que hicimos match 🔥', time: '23:14' },
  { from: 'me',   text: 'Jaja sí! Qué bueno. Estás acá esta noche?', time: '23:15' },
  { from: 'them', text: 'Sí, llegué hace un rato. Estoy en la zona de la barra 🍸', time: '23:15' },
  { from: 'me',   text: 'Perfecto, yo también. Te veo en un rato entonces?', time: '23:16' },
  { from: 'them', text: '¡Dale! Te reconozco por la foto 😄', time: '23:16' },
]

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(MOCK_CHAT)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const profile = mockProfiles.find(p => p.id === params.id) ?? mockProfiles[0]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    setMessages(m => [...m, { from: 'me', text: input.trim(), time }])
    setInput('')
    setSending(true)

    // Mock reply after 1.5s
    setTimeout(() => {
      setMessages(m => [...m, {
        from: 'them',
        text: '¡Jaja! Dale, nos encontramos ahora 🎉',
        time,
      }])
      setSending(false)
    }, 1500)
  }

  return (
    <div className="h-full flex flex-col bg-[#0d0d0f]">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-[#1e1e24] flex-shrink-0">
        <button onClick={() => router.back()} className="text-gray-400 p-1">
          <ChevronLeft size={22} />
        </button>

        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src={profile.photo} alt={profile.name} fill className="object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{profile.name}, {profile.age}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-emerald-400 text-xs">En el lugar esta noche</p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
          <Heart size={10} className="text-rose-400 fill-rose-400" />
          <span className="text-rose-400 text-xs font-medium">Match</span>
        </div>
      </div>

      {/* Match banner */}
      <div className="flex justify-center py-4 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-500/20"
        >
          <span className="text-sm">🎉</span>
          <span className="text-xs text-gray-300">Hicieron match esta noche</span>
          <span className="text-sm">🎉</span>
        </motion.div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4 no-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i < MOCK_CHAT.length ? i * 0.08 : 0 }}
            className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.from === 'them' && (
              <div className="w-7 h-7 rounded-full overflow-hidden relative flex-shrink-0 mr-2 mt-auto">
                <Image src={profile.photo} alt={profile.name} fill className="object-cover" />
              </div>
            )}
            <div className={`max-w-[72%] ${msg.from === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === 'me'
                    ? 'bg-gradient-to-br from-rose-500 to-purple-600 text-white rounded-br-sm'
                    : 'bg-[#1e1e24] text-gray-100 rounded-bl-sm border border-[#2a2a30]'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-600 px-1">{msg.time}</span>
            </div>
          </motion.div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full overflow-hidden relative flex-shrink-0 mr-2">
              <Image src={profile.photo} alt={profile.name} fill className="object-cover" />
            </div>
            <div className="bg-[#1e1e24] border border-[#2a2a30] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gray-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 px-4 pb-10 pt-3 border-t border-[#1e1e24] flex-shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={`Escribile a ${profile.name}...`}
          className="flex-1 bg-[#16161a] border border-[#2a2a30] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={send}
          disabled={!input.trim()}
          className="w-11 h-11 rounded-full flex items-center justify-center disabled:opacity-30 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #f43f5e, #a855f7)' }}
        >
          <Send size={16} className="text-white translate-x-0.5" />
        </motion.button>
      </div>
    </div>
  )
}
