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
  lore: string;
  specs: {
    resonance: string;
    origin: string;
    classType: string;
  };
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
    lore: 'Manifested from ethereal solar flares, Lumina bends surrounding light to veil its form and pierce deep stellar shadows.',
    specs: {
      resonance: '98.4 MHz',
      origin: 'Solar Core 01',
      classType: 'Ethereal / Light',
    },
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
    lore: 'Harnesses high-frequency quantum pulses to encode matter into binary streams, vanishing into encrypted cyberspace.',
    specs: {
      resonance: '104.2 GHz',
      origin: 'Neural Net X',
      classType: 'Cyber / Infiltration',
    },
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
    lore: 'Commands supersonic atmospheric currents, maneuvering with zero friction through tempest vortices.',
    specs: {
      resonance: '840 Mach',
      origin: 'Aero Stratos',
      classType: 'Kinetic / Vanguard',
    },
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
    lore: 'Born from subterranean magma veins, emitting concentrated plasma waves that incinerate cosmic debris.',
    specs: {
      resonance: '3,200 °K',
      origin: 'Magma Caldera',
      classType: 'Plasma / Striker',
    },
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
    lore: 'Synchronizes with deep gravitational frequencies across the universe, creating harmonic ripples that bend cosmic time.',
    specs: {
      resonance: '12.8 Gravitons',
      origin: 'Nebula Rift 05',
      classType: 'Celestial / Harmonic',
    },
  },
];
