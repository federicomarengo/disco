'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, Users } from 'lucide-react'
import { zones } from '@/lib/venue'

export default function MapaPage() {
  const router = useRouter()
  const [myZone, setMyZone] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const selectedZone = zones.find(z => z.id === selected)

  const heatOpacity = (pct: number) => {
    if (pct >= 80) return 0.55
    if (pct >= 55) return 0.38
    if (pct >= 30) return 0.22
    return 0.12
  }

  const heatColor = (pct: number) => {
    if (pct >= 80) return '#f43f5e'
    if (pct >= 55) return '#f97316'
    if (pct >= 30) return '#eab308'
    return '#22c55e'
  }

  return (
    <div className="h-full flex flex-col bg-[#0d0d0f]">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4 flex-shrink-0">
        <button onClick={() => router.back()} className="text-gray-400"><ChevronLeft size={22} /></button>
        <div className="flex-1">
          <h1 className="text-white font-black text-xl">Mapa del lugar</h1>
          <p className="text-gray-500 text-xs">Calor en tiempo real</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1e24] border border-[#2a2a30]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-400 text-xs">Live</span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex gap-3 px-5 pb-3 flex-shrink-0">
        {[['#f43f5e','Lleno'],['#f97316','Animado'],['#eab308','Moderado'],['#22c55e','Tranquilo']].map(([c,l])=>(
          <div key={l} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{background:c}} />
            <span className="text-gray-500 text-[10px]">{l}</span>
          </div>
        ))}
      </div>

      {/* SVG Map */}
      <div className="flex-1 px-4 min-h-0 flex flex-col">
        <div className="relative bg-[#111115] rounded-3xl border border-[#2a2a30] overflow-hidden flex-1">
          <svg viewBox="0 0 560 420" className="w-full h-full" style={{maxHeight: 340}}>
            {/* Background */}
            <rect x="40" y="40" width="480" height="340" rx="20" fill="#16161a" stroke="#2a2a30" strokeWidth="1.5"/>

            {/* Outdoor elements — stars */}
            {[[80,50],[200,45],[400,48],[500,55],[350,42],[130,60]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="1.5" fill="#ffffff" opacity="0.3"/>
            ))}

            {/* Zones */}
            {zones.map(z => (
              <g key={z.id} onClick={() => setSelected(z.id === selected ? null : z.id)} style={{cursor:'pointer'}}>
                {/* Heat fill */}
                <rect
                  x={z.x} y={z.y} width={z.w} height={z.h} rx="12"
                  fill={heatColor(z.capacity)}
                  opacity={heatOpacity(z.capacity)}
                />
                {/* Border */}
                <rect
                  x={z.x} y={z.y} width={z.w} height={z.h} rx="12"
                  fill="none"
                  stroke={selected === z.id ? '#ffffff' : heatColor(z.capacity)}
                  strokeWidth={selected === z.id ? 2 : 1}
                  opacity={selected === z.id ? 0.9 : 0.5}
                />
                {/* Label */}
                <text x={z.x + z.w/2} y={z.y + z.h/2 - 8} textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{z.emoji}</text>
                <text x={z.x + z.w/2} y={z.y + z.h/2 + 8} textAnchor="middle" fill="white" fontSize="10" fontWeight="600" opacity="0.9">{z.name}</text>
                <text x={z.x + z.w/2} y={z.y + z.h/2 + 21} textAnchor="middle" fill={heatColor(z.capacity)} fontSize="9" fontWeight="700">{z.capacity}%</text>

                {/* My location pin */}
                {myZone === z.id && (
                  <motion.g initial={{scale:0}} animate={{scale:1}} style={{transformOrigin:`${z.x+z.w/2}px ${z.y+12}px`}}>
                    <circle cx={z.x + z.w/2} cy={z.y + 12} r="6" fill="#f43f5e" stroke="white" strokeWidth="2"/>
                    <text x={z.x + z.w/2} y={z.y + 16} textAnchor="middle" fontSize="7" fill="white">vos</text>
                  </motion.g>
                )}
              </g>
            ))}

            {/* Stage label */}
            <text x="190" y="72" textAnchor="middle" fill="#6b7280" fontSize="9" opacity="0.7">🎤 ESCENARIO</text>
          </svg>

          {/* Info popup */}
          {selectedZone && (
            <motion.div
              initial={{opacity:0, y:8}} animate={{opacity:1, y:0}}
              className="absolute bottom-3 left-3 right-3 bg-[#1e1e24] rounded-2xl p-4 border border-[#2a2a30]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedZone.emoji}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{selectedZone.name}</p>
                    <p className="text-gray-500 text-xs">{selectedZone.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg" style={{color: heatColor(selectedZone.capacity)}}>{selectedZone.capacity}%</p>
                  <p className="text-gray-500 text-[10px]">ocupación</p>
                </div>
              </div>
              <button
                onClick={() => { setMyZone(selectedZone.id); setSelected(null) }}
                className="w-full py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{background:'linear-gradient(135deg,#f43f5e,#a855f7)'}}
              >
                📍 Estoy acá
              </button>
            </motion.div>
          )}
        </div>

        {/* Zone chips */}
        <div className="py-4 flex-shrink-0">
          <p className="text-gray-500 text-xs mb-3 font-medium">¿Dónde estás?</p>
          <div className="flex flex-wrap gap-2">
            {zones.map(z => (
              <button
                key={z.id}
                onClick={() => setMyZone(z.id === myZone ? null : z.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  myZone === z.id
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-[#16161a] border-[#2a2a30] text-gray-400'
                }`}
              >
                <span>{z.emoji}</span>
                <span>{z.name}</span>
                {myZone === z.id && <span>· vos</span>}
              </button>
            ))}
          </div>
          {myZone && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
              <Users size={12}/>
              <span>Tu ubicación se actualiza en el mapa en tiempo real</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
