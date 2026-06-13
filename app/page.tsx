'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Generar ID anónimo si no existe
    if (!localStorage.getItem('dm_user_id')) {
      localStorage.setItem('dm_user_id', crypto.randomUUID())
    }
    router.replace('/feed')
  }, [router])

  return (
    <div className="h-full flex items-center justify-center bg-[#0d0d0f]">
      <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
