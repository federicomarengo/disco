'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Flame } from 'lucide-react'
import SwipeCard from '@/components/SwipeCard'
import MatchOverlay from '@/components/MatchOverlay'
import { getEventFeed, recordSwipe, DmUser } from '@/lib/db'
import { mockProfiles } from '@/lib/profiles'

function mockToDmUser(p: typeof mockProfiles[0]): DmUser {
  return {
    id: p.id,
    email: '',
    name: p.name,
    age: p.age,
    bio: p.bio,
    photo_url: p.photo,
    interests: p.interests,
  }
}

export default function FeedPage() {
  const [userId, setUserId] = useState('')
  const [profiles, setProfiles] = useState<DmUser[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [match, setMatch] = useState<DmUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [usesMock, setUsesMock] = useState(false)

  useEffect(() => {
    let uid = localStorage.getItem('dm_user_id')
    if (!uid) {
      uid = crypto.randomUUID()
      localStorage.setItem('dm_user_id', uid)
    }
    setUserId(uid)

    const eventId = localStorage.getItem('dm_event_id') ?? ''

    getEventFeed(uid, eventId)
      .then(data => {
        if (data.length > 0) {
          setProfiles(data)
        } else {
          setProfiles(mockProfiles.map(mockToDmUser))
          setUsesMock(true)
        }
      })
      .catch(() => {
        setProfiles(mockProfiles.map(mockToDmUser))
        setUsesMock(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const current = profiles[currentIndex]
  const next = profiles[currentIndex + 1]
  const afterNext = profiles[currentIndex + 2]

  const handleSwipe = useCallback(async (direction: 'like' | 'pass') => {
    if (!current) return
    setCurrentIndex(i => i + 1)

    if (!usesMock) {
      const eventId = localStorage.getItem('dm_event_id') ?? ''
      const isMatch = await recordSwipe(userId, current.id, eventId, direction)
      if (isMatch) setMatch(current)
    } else if (direction === 'like' && Math.random() > 0.5) {
      // Demo: 50% chance de match con mock profiles
      setTimeout(() => setMatch(current), 400)
    }
  }, [current, userId, usesMock])

  const done = !loading && currentIndex >= profiles.length

  return (
    <div className="h-full flex flex-col bg-[#0d0d0f]">

      {/* Header */}
      <div className="flex items-center justify-center px-5 pt-12 pb-4 flex-shrink-0 relative">
        <div className="flex items-center gap-2">
          <Flame size={20} className="text-rose-500" />
          <span className="font-bold text-white text-base">DiscoMatch</span>
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
            <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : done ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 text-center px-8">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-white">¡Viste a todos!</h2>
            <p className="text-gray-500 text-sm">Seguí disfrutando la noche</p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold text-sm"
            >
              Volver a empezar
            </button>
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
            className="w-16 h-16 rounded-full bg-[#16161a] border border-[#2a2a30] flex items-center justify-center shadow-lg opacity-50"
          >
            <Flame size={24} className="text-amber-400" />
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {match && (
          <MatchOverlay profile={match} myEmail="" onClose={() => setMatch(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
