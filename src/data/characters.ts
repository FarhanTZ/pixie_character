export interface PixieCharacter {
  id: string;
  name: string;
  title: string;
  element: string;
  themeColor: string;
  accentColor: string;
  bgImage: string;
  characterImage: string;
  quote: string;
}

export const PIXIE_CHARACTERS: PixieCharacter[] = [
  {
    id: 'pixie-01',
    name: 'AURORA LUMINA',
    title: 'THE RADIANT ESSENCE',
    element: 'SOLAR LIGHT',
    themeColor: '#FFD700',
    accentColor: '#FFA500',
    bgImage: '/assets/pixie/bg/pixie1.png',
    characterImage: '/assets/pixie/nobg/pixie1.png',
    quote: 'Lighting up the twilight with eternal starlight.',
  },
  {
    id: 'pixie-02',
    name: 'CYBER NYX',
    title: 'THE VOID ENCRYPTOR',
    element: 'QUANTUM VOID',
    themeColor: '#00F0FF',
    accentColor: '#7000FF',
    bgImage: '/assets/pixie/bg/pixie2.png',
    characterImage: '/assets/pixie/nobg/pixie2.png',
    quote: 'Dissolving the boundaries of reality into pure digital pulse.',
  },
  {
    id: 'pixie-03',
    name: 'VORTEX SYLPH',
    title: 'THE AERO KINETIC',
    element: 'SONIC TEMPEST',
    themeColor: '#00FF9D',
    accentColor: '#00B4D8',
    bgImage: '/assets/pixie/bg/pixie3.png',
    characterImage: '/assets/pixie/nobg/pixie3.png',
    quote: 'Dancing through the slipstream of frictionless kinetic winds.',
  },
  {
    id: 'pixie-04',
    name: 'IGNIS VALKYRIE',
    title: 'THE CRIMSON FLAME',
    element: 'PLASMA INFERNO',
    themeColor: '#FF3366',
    accentColor: '#FF6B00',
    bgImage: '/assets/pixie/bg/pixie4.png',
    characterImage: '/assets/pixie/nobg/pixie4.png',
    quote: 'Awakening superheated celestial fire with fierce determination.',
  },
  {
    id: 'pixie-05',
    name: 'NEBULA SIREN',
    title: 'THE COSMIC HARMONIC',
    element: 'GRAVITY CELESTIAL',
    themeColor: '#D946EF',
    accentColor: '#8B5CF6',
    bgImage: '/assets/pixie/bg/pixie5.png',
    characterImage: '/assets/pixie/nobg/pixie5.png',
    quote: 'Resonating across the galactic depths of space and time.',
  },
];
