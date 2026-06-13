export interface Drink {
  id: string
  name: string
  category: string
  price: number
  emoji: string
  description: string
  popular?: boolean
}

export const drinks: Drink[] = [
  { id: 'd1', name: 'Fernet con Coca', category: 'Clásicos', price: 3500, emoji: '🥃', description: 'Fernet Branca + Coca Cola', popular: true },
  { id: 'd2', name: 'Gin Tónica', category: 'Clásicos', price: 4200, emoji: '🍸', description: 'Gin Beefeater + agua tónica + pepino', popular: true },
  { id: 'd3', name: 'Aperol Spritz', category: 'Clásicos', price: 4500, emoji: '🥂', description: 'Aperol + prosecco + naranja' },
  { id: 'd4', name: 'Mojito', category: 'Tragos', price: 4800, emoji: '🍹', description: 'Ron + menta + lima + azúcar', popular: true },
  { id: 'd5', name: 'Sex on the Beach', category: 'Tragos', price: 5000, emoji: '🍊', description: 'Vodka + melocotón + jugo de naranja y arándano' },
  { id: 'd6', name: 'Tequila Sunrise', category: 'Tragos', price: 4600, emoji: '🌅', description: 'Tequila + jugo de naranja + granadina' },
  { id: 'd7', name: 'Cerveza Stella', category: 'Cervezas', price: 2200, emoji: '🍺', description: '500ml · bien fría' },
  { id: 'd8', name: 'Cerveza Corona', category: 'Cervezas', price: 2500, emoji: '🍻', description: '355ml + limón', popular: true },
  { id: 'd9', name: 'Shot de Vodka', category: 'Shots', price: 1800, emoji: '🥃', description: 'Vodka Absolut · 50ml' },
  { id: 'd10', name: 'Agua mineral', category: 'Sin alcohol', price: 800, emoji: '💧', description: '500ml' },
]

export const categories = Array.from(new Set(drinks.map(d => d.category)))
