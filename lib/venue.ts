export interface Zone {
  id: string
  name: string
  emoji: string
  capacity: number   // % 0-100
  color: string      // tailwind color for heatmap
  description: string
  // SVG coordinates for the map
  x: number
  y: number
  w: number
  h: number
}

export const zones: Zone[] = [
  { id: 'entrada',  name: 'Entrada',       emoji: '🚪', capacity: 45, color: '#22c55e', description: 'Acceso principal', x: 340, y: 320, w: 80,  h: 60  },
  { id: 'pista',    name: 'Pista',          emoji: '🎵', capacity: 87, color: '#f43f5e', description: 'Pista de baile principal — DJ en vivo', x: 80,  y: 80,  w: 220, h: 200 },
  { id: 'barra',    name: 'Barra',          emoji: '🍸', capacity: 72, color: '#f97316', description: 'Barra principal', x: 320, y: 80,  w: 160, h: 80  },
  { id: 'vip',      name: 'Zona VIP',       emoji: '⭐', capacity: 30, color: '#a855f7', description: 'Mesas reservadas', x: 320, y: 180, w: 160, h: 120 },
  { id: 'terraza',  name: 'Terraza',        emoji: '🌿', capacity: 55, color: '#eab308', description: 'Al aire libre · vista al parque', x: 80,  y: 300, w: 220, h: 100 },
]

export function capacityColor(pct: number): string {
  if (pct >= 80) return 'rgba(244,63,94,VAR)'     // rojo — lleno
  if (pct >= 55) return 'rgba(249,115,22,VAR)'    // naranja — animado
  if (pct >= 30) return 'rgba(234,179,8,VAR)'     // amarillo — moderado
  return 'rgba(34,197,94,VAR)'                    // verde — tranquilo
}
