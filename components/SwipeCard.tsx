'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import Image from 'next/image'
import { Profile } from '@/lib/profiles'

interface SwipeCardProps {
  profile: Profile
  onSwipe: (direction: 'like' | 'pass') => void
  isTop: boolean
  stackIndex: number
}

export default function SwipeCard({ profile, onSwipe, isTop, stackIndex }: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-28, 28])
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const passOpacity = useTransform(x, [-100, -20], [1, 0])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 90) {
      onSwipe('like')
    } else if (info.offset.x < -90) {
      onSwipe('pass')
    }
  }

  const scale = 1 - stackIndex * 0.04
  const yOffset = stackIndex * 14

  if (!isTop) {
    return (
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          transform: `scale(${scale}) translateY(${yOffset}px)`,
          zIndex: 10 - stackIndex,
        }}
      >
        <div className="w-full h-full bg-[#16161a] rounded-3xl border border-[#2a2a30]" />
      </div>
    )
  }

  return (
    <motion.div
      className="absolute inset-0 swipe-card cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 20 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.03 }}
    >
      {/* Card */}
      <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-2xl border border-white/5">
        {/* Photo */}
        <Image
          src={profile.photo}
          alt={profile.name}
          fill
          className="object-cover"
          priority
          draggable={false}
        />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* LIKE badge */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-8 border-4 border-emerald-400 rounded-xl px-4 py-2 rotate-[-20deg]"
        >
          <span className="text-emerald-400 font-black text-2xl tracking-widest">LIKE</span>
        </motion.div>

        {/* NOPE badge */}
        <motion.div
          style={{ opacity: passOpacity }}
          className="absolute top-10 right-8 border-4 border-rose-400 rounded-xl px-4 py-2 rotate-[20deg]"
        >
          <span className="text-rose-400 font-black text-2xl tracking-widest">NOPE</span>
        </motion.div>

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <div className="flex items-end gap-3">
            <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
            <span className="text-2xl font-light text-white/80 mb-0.5">{profile.age}</span>
          </div>

          <p className="text-sm text-white/75 leading-relaxed">{profile.bio}</p>

          <div className="flex flex-wrap gap-2 pt-1">
            {profile.interests.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 backdrop-blur-sm border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
