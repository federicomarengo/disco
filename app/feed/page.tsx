'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Flame, ChevronLeft } from 'lucide-react'
import SwipeCard from '@/components/SwipeCard'
import MatchOverlay from '@/components/MatchOverlay'
import { mockProfiles, Profile } from '@/lib/profiles'

export default function FeedPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [match, setMatch] = useState<Profile | null>(null)
  const [likeAnim, setLikeAnim] = useState(false)
  const [passAnim, setPassAnim] = useState(false)
  const [swipedCount, setSwipedCount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('dm_email')
    if (!stored) { router.replace('/'); return }
    setEmail(stored)
    setProfiles([...mockProfiles])
  }, [router])

  const current = profiles[currentIndex]
  const next = profiles[currentIndex + 1]
  const afterNext = profiles[currentIndex + 2]

  const handleSwipe = useCallback((direction: 'like' | 'pass') => {
    if (!current) return

    if (direction === 'like') {
      setLikeAnim(true)
      setTimeout(() => setLikeAnim(false), 600)
      if (current.willMatch) {
        setTimeout(() => setMatch(current), 400)
      }
    } else {
      setPassAnim(true)
      setTimeout(() => setPassAnim(false), 600)
    }

    setSwipedCount(c => c + 1)
    setCurrentIndex(i => i + 1)
  }, [current])

  const handleLikeButton = () => handleSwipe('like')
  const handlePassButton = () => handleSwipe('pass')

  const done = currentIndex >= profiles.length

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
          <span className="text-xs text-gray-400 font-medium">Evento de esta noche · 234 personas</span>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 px-5 relative min-h-0">
        {done ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 text-center px-8">
            <div className="text-6xl">🎉</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">¡Viste a todos!</h2>
              <p className="text-gray-500 text-sm">
                Tuviste {swipedCount} perfiles esta noche
              </p>
            </div>
            <button
              onClick={() => { setCurrentIndex(0); setSwipedCount(0) }}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold text-sm"
            >
              Volver a empezar
            </button>
          </div>
        ) : (
          <div className="relative h-full">
            {/* Stack: render up to 3 cards */}
            <AnimatePresence>
              {afterNext && (
                <SwipeCard
                  key={afterNext.id}
                  profile={afterNext}
                  onSwipe={handleSwipe}
                  isTop={false}
                  stackIndex={2}
                />
              )}
              {next && (
                <SwipeCard
                  key={next.id}
                  profile={next}
                  onSwipe={handleSwipe}
                  isTop={false}
                  stackIndex={1}
                />
              )}
              {current && (
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    x: likeAnim ? 300 : passAnim ? -300 : 0,
                    opacity: 0,
                    transition: { duration: 0.3 },
                  }}
                >
                  <SwipeCard
                    profile={current}
                    onSwipe={handleSwipe}
                    isTop={true}
                    stackIndex={0}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!done && (
        <div className="flex items-center justify-center gap-6 py-8 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePassButton}
            className="w-16 h-16 rounded-full bg-[#16161a] border border-[#2a2a30] flex items-center justify-center shadow-lg"
          >
            <X size={28} className="text-rose-400" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLikeButton}
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #a855f7)' }}
          >
            <Heart size={32} className="text-white fill-white" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {}}
            className="w-16 h-16 rounded-full bg-[#16161a] border border-[#2a2a30] flex items-center justify-center shadow-lg"
          >
            <Flame size={24} className="text-amber-400" />
          </motion.button>
        </div>
      )}

      {/* Match overlay */}
      <AnimatePresence>
        {match && (
          <MatchOverlay
            profile={match}
            myEmail={email}
            onClose={() => setMatch(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
