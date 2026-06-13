'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Profile } from '@/lib/profiles'

interface MatchOverlayProps {
  profile: Profile
  myEmail: string
  onClose: () => void
}

export default function MatchOverlay({ profile, myEmail, onClose }: MatchOverlayProps) {
  const myInitial = myEmail.charAt(0).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
      style={{ background: 'linear-gradient(160deg, rgba(244,63,94,0.85) 0%, rgba(168,85,247,0.85) 100%)' }}
    >
      {/* Animated particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/60"
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 600,
            opacity: [0, 1, 0],
          }}
          transition={{ delay: i * 0.05, duration: 1.5, ease: 'easeOut' }}
          style={{ left: '50%', top: '50%' }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
        className="text-center space-y-8 w-full"
      >
        {/* Title */}
        <div className="space-y-1">
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-base font-medium tracking-widest uppercase"
          >
            Es un
          </motion.p>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-black text-white drop-shadow-lg"
          >
            Match! 🔥
          </motion.h1>
        </div>

        {/* Avatars */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center gap-4"
        >
          {/* My avatar */}
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{myInitial}</span>
          </div>

          <div className="text-white text-3xl font-black">💘</div>

          {/* Match avatar */}
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden relative">
            <Image src={profile.photo} alt={profile.name} fill className="object-cover" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <p className="text-white text-xl font-semibold">
            Vos y {profile.name} se gustaron
          </p>
          <p className="text-white/70 text-sm">
            Están esta noche en el mismo lugar 🎉
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3 pt-2"
        >
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-white text-rose-600 font-bold text-base shadow-lg"
          >
            Seguir viendo 👀
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl border border-white/30 text-white font-medium text-sm"
          >
            Más tarde
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
