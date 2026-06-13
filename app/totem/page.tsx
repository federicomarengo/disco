'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ShoppingCart, Check, Clock } from 'lucide-react'
import { drinks, categories, Drink } from '@/lib/drinks'

type Step = 'menu' | 'confirm' | 'qr'

export default function TotemPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [cart, setCart] = useState<Drink[]>([])
  const [step, setStep] = useState<Step>('menu')
  const [countdown, setCountdown] = useState(180) // 3 min in seconds
  const [code] = useState(() => Math.floor(1000 + Math.random() * 9000).toString())

  const filtered = drinks.filter(d => d.category === activeCategory)
  const total = cart.reduce((s, d) => s + d.price, 0)

  const addToCart = (d: Drink) => setCart(c => [...c, d])
  const removeFromCart = (id: string) => {
    const idx = cart.findLastIndex(d => d.id === id)
    if (idx !== -1) setCart(c => c.filter((_, i) => i !== idx))
  }
  const countInCart = (id: string) => cart.filter(d => d.id === id).length

  const handlePay = () => {
    setStep('qr')
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(interval); return 0 }
        return c - 1
      })
    }, 1000)
  }

  const mins = Math.floor(countdown / 60)
  const secs = countdown % 60

  return (
    <div className="h-full flex flex-col bg-[#0d0d0f]">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4 flex-shrink-0 border-b border-[#1e1e24]">
        <button onClick={() => step === 'menu' ? router.back() : setStep('menu')} className="text-gray-400">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-white font-black text-xl">
            {step === 'menu' ? 'Carta de bebidas' : step === 'confirm' ? 'Tu pedido' : '¡Pedido listo!'}
          </h1>
          <p className="text-gray-500 text-xs">Retirás en barra sin hacer fila</p>
        </div>
        {step === 'menu' && cart.length > 0 && (
          <button
            onClick={() => setStep('confirm')}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30"
          >
            <ShoppingCart size={16} className="text-rose-400" />
            <span className="text-rose-400 text-sm font-bold">{cart.length}</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">

        {/* MENU */}
        {step === 'menu' && (
          <motion.div key="menu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col min-h-0">
            {/* Categories */}
            <div className="flex gap-2 px-5 py-3 overflow-x-auto no-scrollbar flex-shrink-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white border-transparent'
                      : 'bg-[#16161a] text-gray-400 border-[#2a2a30]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Drinks */}
            <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-3 no-scrollbar">
              {filtered.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: i*0.05}}
                  className="bg-[#16161a] rounded-2xl p-4 border border-[#2a2a30]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{d.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-sm">{d.name}</p>
                        {d.popular && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-medium">Popular</span>}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">{d.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-black text-base">${(d.price/1000).toFixed(1)}k</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-3 gap-3">
                    {countInCart(d.id) > 0 && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(d.id)} className="w-7 h-7 rounded-full bg-[#2a2a30] text-white text-lg font-bold flex items-center justify-center">−</button>
                        <span className="text-white font-bold text-sm w-4 text-center">{countInCart(d.id)}</span>
                      </div>
                    )}
                    <button
                      onClick={() => addToCart(d)}
                      className="px-4 py-1.5 rounded-xl text-white text-xs font-bold"
                      style={{background:'linear-gradient(135deg,#f43f5e,#a855f7)'}}
                    >
                      + Agregar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart bar */}
            {cart.length > 0 && (
              <motion.div
                initial={{y:100}} animate={{y:0}}
                className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-gradient-to-t from-[#0d0d0f] to-transparent"
              >
                <div className="max-w-md mx-auto">
                  <button
                    onClick={() => setStep('confirm')}
                    className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-xl flex items-center justify-between px-6"
                    style={{background:'linear-gradient(135deg,#f43f5e,#a855f7)'}}
                  >
                    <span>{cart.length} {cart.length === 1 ? 'bebida' : 'bebidas'}</span>
                    <span>Ver pedido →</span>
                    <span>${(total/1000).toFixed(1)}k</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* CONFIRM */}
        {step === 'confirm' && (
          <motion.div key="confirm" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0}} className="flex-1 flex flex-col px-5 py-4 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
              {Array.from(new Set(cart.map(d=>d.id))).map(id => {
                const d = drinks.find(x=>x.id===id)!
                const qty = countInCart(id)
                return (
                  <div key={id} className="flex items-center gap-3 bg-[#16161a] rounded-2xl p-4 border border-[#2a2a30]">
                    <span className="text-2xl">{d.emoji}</span>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{d.name}</p>
                      <p className="text-gray-500 text-xs">x{qty} · ${(d.price*qty/1000).toFixed(1)}k</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-[#1e1e24] pt-4 mt-4 space-y-3 flex-shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total</span>
                <span className="text-white font-black text-xl">${(total/1000).toFixed(1)}k</span>
              </div>
              <p className="text-gray-600 text-xs text-center">Pago con QR · MercadoPago · Tarjeta</p>
              <button
                onClick={handlePay}
                className="w-full py-4 rounded-2xl text-white font-bold text-base"
                style={{background:'linear-gradient(135deg,#f43f5e,#a855f7)'}}
              >
                Pagar y retirar en barra 🍸
              </button>
            </div>
          </motion.div>
        )}

        {/* QR */}
        {step === 'qr' && (
          <motion.div key="qr" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200,delay:0.1}}>
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                <Check size={20} className="text-white" />
              </div>
            </motion.div>

            <div className="text-center space-y-1">
              <h2 className="text-white font-black text-2xl">¡Pedido confirmado!</h2>
              <p className="text-gray-400 text-sm">Mostrá este código en la barra</p>
            </div>

            {/* QR mock */}
            <div className="bg-white rounded-3xl p-5 shadow-2xl">
              <svg viewBox="0 0 120 120" width="180" height="180">
                {/* Mock QR pattern */}
                {Array.from({length:10}).map((_,r)=>Array.from({length:10}).map((_,c)=>{
                  const on = (r+c+r*c)%3 !== 0
                  return on ? <rect key={`${r}-${c}`} x={c*12} y={r*12} width="10" height="10" rx="1" fill="#0d0d0f"/> : null
                }))}
                <rect x="0" y="0" width="36" height="36" rx="4" fill="none" stroke="#0d0d0f" strokeWidth="4"/>
                <rect x="84" y="0" width="36" height="36" rx="4" fill="none" stroke="#0d0d0f" strokeWidth="4"/>
                <rect x="0" y="84" width="36" height="36" rx="4" fill="none" stroke="#0d0d0f" strokeWidth="4"/>
              </svg>
              <p className="text-center font-black text-3xl tracking-widest text-[#0d0d0f] mt-2">{code}</p>
            </div>

            {/* Countdown */}
            <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl ${countdown > 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
              <Clock size={16} className={countdown > 0 ? 'text-amber-400' : 'text-emerald-400'} />
              {countdown > 0
                ? <span className="text-amber-400 font-semibold text-sm">Listo en {mins}:{String(secs).padStart(2,'0')} min</span>
                : <span className="text-emerald-400 font-semibold text-sm">¡Tu pedido está listo! 🎉</span>
              }
            </div>

            <div className="w-full space-y-2">
              <div className="text-center">
                <p className="text-gray-500 text-xs">Total pagado: <span className="text-white font-bold">${(total/1000).toFixed(1)}k</span></p>
              </div>
              <button
                onClick={() => { setCart([]); setStep('menu'); setCountdown(180) }}
                className="w-full py-3 rounded-2xl border border-[#2a2a30] text-gray-400 font-medium text-sm"
              >
                Pedir otra bebida
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
