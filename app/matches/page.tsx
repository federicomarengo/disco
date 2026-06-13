'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, MessageCircle, Heart } from 'lucide-react'
import { mockProfiles } from '@/lib/profiles'

interface MatchEntry {
  profileId: string
  matchedAt: string
}

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<MatchEntry[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('dm_matches')
    if (stored) {
      setMatches(JSON.parse(stored))
    } else {
      // Demo: pre-load 2 matches so the screen isn't empty
      const demo: MatchEntry[] = [
        { profileId: '1', matchedAt: new Date(Date.now() - 18 * 60000).toISOString() },
        { profileId: '3', matchedAt: new Date(Date.now() - 5 * 60000).toISOString() },
      ]
      setMatches(demo)
    }
  }, [])

  const getProfile = (id: string) => mockProfiles.find(p => p.id === id) ?? mockProfiles[0]

  const timeAgo = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
    if (mins < 1) return 'ahora'
    if (mins < 60) return `hace ${mins} min`
    return `hace ${Math.floor(mins / 60)}h`
  }

  const PREVIEW_MSGS = [
    '¡Hola! Vi que hicimos match 🔥',
    'Estoy en la zona de la barra 🍸',
    '¿Me encontrás en la terraza? 🌿',
    'Dale, nos vemos en un rato 🎉',
  ]

  return (
    <div className="h-full flex flex-col bg-[#0d0d0f]">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-5 flex-shrink-0">
        <button onClick={() => router.back()} className="text-gray-400">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-white font-black text-xl">Mis matches</h1>
          <p className="text-gray-500 text-xs">{matches.length} esta noche</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
          <Heart size={12} className="text-rose-400 fill-rose-400" />
          <span className="text-rose-400 text-xs font-medium">{matches.length}</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-8 no-scrollbar">
        {matches.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center pt-24">
            <span className="text-5xl">💘</span>
            <p className="text-white font-semibold">Todavía sin matches</p>
            <p className="text-gray-500 text-sm">Volvé al feed y empezá a swipear</p>
            <button
              onClick={() => router.push('/feed')}
              className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold text-sm"
            >
              Ir al feed
            </button>
          </div>
        ) : (
          matches.map((m, i) => {
            const p = getProfile(m.profileId)
            return (
              <motion.button
                key={m.profileId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => router.push(`/chat/${p.id}`)}
                className="w-full flex items-center gap-4 bg-[#16161a] rounded-2xl p-4 border border-[#2a2a30] text-left"
              >
                {/* Avatar with match ring */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden relative ring-2 ring-rose-500/60">
                    <Image src={p.photo} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#16161a]" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-white font-semibold text-sm">{p.name}, {p.age}</p>
                    <span className="text-gray-600 text-xs">{timeAgo(m.matchedAt)}</span>
                  </div>
                  <p className="text-gray-400 text-xs truncate">
                    {PREVIEW_MSGS[i % PREVIEW_MSGS.length]}
                  </p>
                </div>

                <MessageCircle size={18} className="text-rose-400 flex-shrink-0" />
              </motion.button>
            )
          })
        )}
      </div>
    </div>
  )
}
