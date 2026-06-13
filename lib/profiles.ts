export interface Profile {
  id: string
  name: string
  age: number
  bio: string
  photo: string
  interests: string[]
  willMatch: boolean
}

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Valentina',
    age: 24,
    bio: 'Reggaetón, mate y noches que no terminan. Si bailás cumbia nos llevamos bien 🔥',
    photo: 'https://i.pravatar.cc/600?img=47',
    interests: ['Bailar', 'Música', 'Arte'],
    willMatch: true,
  },
  {
    id: '2',
    name: 'Lucía',
    age: 22,
    bio: 'Estudiante de diseño. Salgo los viernes a desconectar del canvas 🎨',
    photo: 'https://i.pravatar.cc/600?img=44',
    interests: ['Diseño', 'Fotografía', 'Café'],
    willMatch: false,
  },
  {
    id: '3',
    name: 'Camila',
    age: 26,
    bio: 'Me gusta el buen trago y la buena música. Aquí por pasar una buena noche ✨',
    photo: 'https://i.pravatar.cc/600?img=32',
    interests: ['Cócteles', 'Electrónica', 'Viajes'],
    willMatch: true,
  },
  {
    id: '4',
    name: 'Martina',
    age: 23,
    bio: 'Psicóloga de día, bailarina de noche. Encontrate conmigo en la pista 🌙',
    photo: 'https://i.pravatar.cc/600?img=25',
    interests: ['Psicología', 'Baile', 'Lecturas'],
    willMatch: false,
  },
  {
    id: '5',
    name: 'Sofía',
    age: 27,
    bio: 'Arquitecta, amante del Jazz y el vino tinto. También me sé todos los temas de Duki 🎵',
    photo: 'https://i.pravatar.cc/600?img=20',
    interests: ['Arquitectura', 'Jazz', 'Vino'],
    willMatch: true,
  },
  {
    id: '6',
    name: 'Agustina',
    age: 21,
    bio: 'Primera vez en este lugar. Vengo a conocer gente nueva y ver qué pasa 😊',
    photo: 'https://i.pravatar.cc/600?img=36',
    interests: ['Viajes', 'Música', 'Amigos'],
    willMatch: false,
  },
  {
    id: '7',
    name: 'Florencia',
    age: 25,
    bio: 'Marketing de día, fiesta de noche. Dicen que sé elegir los mejores lugares 🍸',
    photo: 'https://i.pravatar.cc/600?img=9',
    interests: ['Marketing', 'Moda', 'Cócteles'],
    willMatch: true,
  },
  {
    id: '8',
    name: 'Rocío',
    age: 24,
    bio: 'Abogada en formación. Amo el derecho y odio los lunes. Acá solo hay viernes 🎉',
    photo: 'https://i.pravatar.cc/600?img=28',
    interests: ['Derecho', 'Debates', 'Baile'],
    willMatch: false,
  },
  {
    id: '9',
    name: 'Isabella',
    age: 28,
    bio: 'Médica residente buscando desconectar. Que sea una noche de 10/10 💫',
    photo: 'https://i.pravatar.cc/600?img=49',
    interests: ['Medicina', 'Yoga', 'Gastronomía'],
    willMatch: true,
  },
  {
    id: '10',
    name: 'Julieta',
    age: 22,
    bio: 'Me gusta el trap, el sushi y las conversaciones profundas a las 3AM 🌃',
    photo: 'https://i.pravatar.cc/600?img=16',
    interests: ['Trap', 'Sushi', 'Filosofía'],
    willMatch: false,
  },
]
