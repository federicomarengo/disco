'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      setError('Ingresá un email válido')
      return
    }
    setError('')
    setLoading(true)
    localStorage.setItem('dm_email', trimmed)
    localStorage.setItem('dm_name', trimmed.split('@')[0])
    setTimeout(() => router.push('/feed'), 600)
  }

  return (
    <div className="h-full flex flex-col items-center justify-between px-6 py-12 bg-[#0d0d0f]">

      {/* Top decoration */}
      <div className="w-full flex justify-center pt-8">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full scale-150" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative text-7xl"
          >
            🎉
          </motion.div>
        </div>
      </div>

      {/* Center content */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full flex flex-col gap-8"
      >
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight gradient-text">
            DiscoMatch
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Conocé gente que está esta noche<br />en el mismo lugar que vos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="tu@email.com"
              autoComplete="email"
              className="
                w-full px-5 py-4 rounded-2xl text-base
                bg-[#16161a] border border-[#2a2a30]
                text-white placeholder-gray-600
                focus:outline-none focus:border-pink-500
                transition-colors
              "
            />
            {error && (
              <p className="text-rose-400 text-sm pl-1">{error}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading || !email}
            whileTap={{ scale: 0.97 }}
            className="
              w-full py-4 rounded-2xl text-base font-semibold
              bg-gradient-to-r from-rose-500 to-purple-600
              text-white shadow-lg shadow-rose-900/30
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-opacity
            "
          >
            {loading ? 'Entrando...' : 'Entrar al evento'}
          </motion.button>
        </form>

        <p className="text-center text-xs text-gray-600">
          Sin contraseña · Perfil solo por esta noche
        </p>
      </motion.div>

      {/* Bottom badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a30] text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          234 personas van esta noche
        </div>
      </div>

    </div>
  )
}
