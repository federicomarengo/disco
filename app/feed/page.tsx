'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Flame, ChevronLeft } from 'lucide-react'
import SwipeCard from '@/components/SwipeCard'
import MatchOverlay from '@/components/MatchOverlay'
import { getEventFeed, recordSwipe, DmUser } from '@/lib/db'

export default function FeedPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [eventId, setEventId] = useState('')
  const [profiles, setProfiles] = useState<DmUser[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [match, setMatch] = useState<DmUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const uid = localStorage.getItem('dm_user_id')
    const eid = localStorage.getItem('dm_event_id')
    const em = localStorage.getItem('dm_email')
    if (!uid || !eid) { router.replace('/'); return }
    setUserId(uid)
    setEventId(eid)
    setEmail(em ?? '')

    getEventFeed(uid, eid).then(data => {
      setProfiles(data)
      setLoading(false)
    })
  }, [router])

  const current = profiles[currentIndex]
  const next = profiles[currentIndex + 1]
  const afterNext = profiles[currentIndex + 2]

  const handleSwipe = useCallback(async (direction: 'like' | 'pass') => {
    if (!current) return
    setCurrentIndex(i => i + 1)

    const isMatch = await recordSwipe(userId, current.id, eventId, direction)
    if (isMatch) setMatch(current)
  }, [current, userId, eventId])

  const done = !loading && currentIndex >= profiles.length

  return (
    <div className="h-full flex flex-col bg-[#0d0d0f]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 flex-shrink-0">
        <button
          onClick={() => router.push('/')}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#2a2a30] text-gray-400"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          <Flame size={20} className="text-rose-500" />
          <span className="font-bold text-white text-base">DiscoMatch</span>
        </div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{email.charAt(0).toUpperCase()}</span>
        </div>
      </div>

      {/* Event pill */}
      <div className="flex justify-center pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16161a] border border-[#2a2a30]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">Evento de esta noche</span>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 px-5 relative min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="space-y-3 text-center">
              <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 text-sm">Cargando perfiles...</p>
            </div>
          </div>
        ) : done ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 text-center px-8">
            <div className="text-6xl">🎉</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">¡Viste a todos!</h2>
              <p className="text-gray-500 text-sm">Seguí disfrutando la noche</p>
            </div>
          </div>
        ) : (
          <div className="relative h-full">
            <AnimatePresence>
              {afterNext && (
                <SwipeCard key={afterNext.id} profile={afterNext} onSwipe={handleSwipe} isTop={false} stackIndex={2} />
              )}
              {next && (
                <SwipeCard key={next.id} profile={next} onSwipe={handleSwipe} isTop={false} stackIndex={1} />
              )}
              {current && (
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <SwipeCard profile={current} onSwipe={handleSwipe} isTop={true} stackIndex={0} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Buttons */}
      {!loading && !done && (
        <div className="flex items-center justify-center gap-6 py-8 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('pass')}
            className="w-16 h-16 rounded-full bg-[#16161a] border border-[#2a2a30] flex items-center justify-center shadow-lg"
          >
            <X size={28} className="text-rose-400" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('like')}
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #a855f7)' }}
          >
            <Heart size={32} className="text-white fill-white" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-[#16161a] border border-[#2a2a30] flex items-center justify-center shadow-lg"
          >
            <Flame size={24} className="text-amber-400" />
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {match && (
          <MatchOverlay profile={match} myEmail={email} onClose={() => setMatch(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
