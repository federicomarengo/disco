'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'

const PREVIEW_PROFILES = [
  { name: 'Valentina', age: 24, photo: 'https://i.pravatar.cc/400?img=47' },
  { name: 'Camila', age: 26, photo: 'https://i.pravatar.cc/400?img=32' },
  { name: 'Sofía', age: 27, photo: 'https://i.pravatar.cc/400?img=20' },
]

export default function LandingPage() {
  const router = useRouter()

  const enter = () => {
    if (!localStorage.getItem('dm_user_id')) {
      localStorage.setItem('dm_user_id', crypto.randomUUID())
    }
    router.push('/feed')
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0c] overflow-hidden relative">

      {/* Ambient glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-rose-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-purple-700/15 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] rounded-full bg-rose-700/10 blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-2 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <span className="font-black text-white tracking-tight text-lg">DiscoMatch</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">Esta noche</span>
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-between px-6 pb-10 relative z-10 min-h-0">

        {/* Top text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="pt-6 space-y-3"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-rose-400">
            Córdoba · Apertura
          </p>
          <h1 className="text-[2.6rem] font-black leading-[1.05] text-white">
            Conocé gente<br />
            <span className="gradient-text">antes de llegar.</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed pt-1">
            Matcheá con personas que van esta noche al mismo lugar. Sin apps, sin descarga, solo entrás.
          </p>
        </motion.div>

        {/* Preview cards stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative h-52 my-6"
        >
          {PREVIEW_PROFILES.map((p, i) => (
            <div
              key={p.name}
              className="absolute rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              style={{
                width: 120,
                height: 160,
                left: `${i * 72 + 20}px`,
                top: i === 1 ? 0 : 20,
                zIndex: i === 1 ? 3 : i === 0 ? 2 : 1,
                transform: `rotate(${i === 0 ? -8 : i === 2 ? 8 : 0}deg)`,
              }}
            >
              <Image src={p.photo} alt={p.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2">
                <p className="text-white text-xs font-bold">{p.name}</p>
                <p className="text-white/60 text-[10px]">{p.age} años</p>
              </div>
              {i === 1 && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                  <span className="text-[10px]">❤️</span>
                </div>
              )}
            </div>
          ))}

          {/* Match badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 260 }}
            className="absolute bottom-0 right-4 bg-gradient-to-r from-rose-500 to-purple-600 rounded-2xl px-4 py-2 shadow-lg"
          >
            <p className="text-white text-sm font-bold">¡Es un match! 🎉</p>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 mb-6"
        >
          {[
            { n: '234', label: 'personas esta noche' },
            { n: '89', label: 'matches hoy' },
            { n: '🆓', label: 'sin registro' },
          ].map(({ n, label }) => (
            <div key={label} className="flex-1 bg-[#16161a] rounded-2xl p-3 border border-[#2a2a30] text-center">
              <p className="text-white font-black text-lg">{n}</p>
              <p className="text-gray-500 text-[10px] leading-tight mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-3"
        >
          <motion.button
            onClick={enter}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-bold text-base text-white shadow-lg shadow-rose-900/40 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 100%)' }}
          >
            <motion.span
              className="absolute inset-0 bg-white/10"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ delay: 1.2, duration: 0.8, ease: 'easeInOut' }}
            />
            Quiero participar esta noche →
          </motion.button>

          <p className="text-center text-xs text-gray-600">
            Sin descarga · Sin contraseña · Perfil solo por esta noche
          </p>
        </motion.div>

      </div>
    </div>
  )
}
