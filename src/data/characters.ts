export interface PixarCharacter {
  id: string;
  slug: string;
  name: string;
  title: string;
  element: string;
  themeColor: string;
  accentColor: string;
  bgImage: string;
  characterImage: string;
  videoUrl: string;
  frameFolder: string;
  transparentFrameFolder: string;
  frameCount: number;
  quote: string;
  lore: string;
  specs: {
    resonance: string;
    origin: string;
    classType: string;
  };
  details: {
    backstory: string;
    ability1: { name: string; desc: string };
    ability2: { name: string; desc: string };
    ability3: { name: string; desc: string };
    stats: {
      power: number;
      speed: number;
      intelligence: number;
      durability: number;
      energy: number;
    };
  };
}

export const PIXAR_CHARACTERS: PixarCharacter[] = [
  {
    id: 'pixar-01',
    slug: 'aurora-lumina',
    name: 'AURORA LUMINA',
    title: 'THE RADIANT ESSENCE',
    element: 'SOLAR LIGHT',
    themeColor: '#FFD700',
    accentColor: '#FFA500',
    bgImage: '/assets/pixar/bg/character1.png',
    characterImage: '/assets/pixar/nobg/character1.png',
    videoUrl: '/assets/pixar/video/character1.mp4',
    frameFolder: '/assets/pixar/frames/character1',
    transparentFrameFolder: '/assets/pixar/frames_transparent/character1',
    frameCount: 96,
    quote: 'Lighting up the twilight with eternal starlight.',
    lore: 'Manifested from ethereal solar flares, Lumina bends surrounding light to veil its form and pierce deep stellar shadows.',
    specs: {
      resonance: '98.4 MHz',
      origin: 'Solar Core 01',
      classType: 'Ethereal / Light',
    },
    details: {
      backstory: 'Forged at the epicenter of a dying solar star, Lumina channels high-density photons into devastating solar blasts and blinding speed barriers.',
      ability1: { name: 'Solar Flare', desc: 'Emits a concentrated wave of 10,000 lumen light blinding and vaporizing threats.' },
      ability2: { name: 'Photon Shift', desc: 'Bends localized light rays to teleport instantaneously across optical fields.' },
      ability3: { name: 'Prismatic Veil', desc: 'Envelops allies in a crystalline aura that deflects incoming energy attacks.' },
      stats: { power: 92, speed: 98, intelligence: 90, durability: 82, energy: 99 },
    },
  },
  {
    id: 'pixar-02',
    slug: 'cyber-nyx',
    name: 'CYBER NYX',
    title: 'THE VOID ENCRYPTOR',
    element: 'QUANTUM VOID',
    themeColor: '#00F0FF',
    accentColor: '#7000FF',
    bgImage: '/assets/pixar/bg/character2.png',
    characterImage: '/assets/pixar/nobg/character2.png',
    videoUrl: '/assets/pixar/video/character2.mp4',
    frameFolder: '/assets/pixar/frames/character2',
    transparentFrameFolder: '/assets/pixar/frames_transparent/character2',
    frameCount: 96,
    quote: 'Dissolving the boundaries of reality into pure digital pulse.',
    lore: 'Harnesses high-frequency quantum pulses to encode matter into binary streams, vanishing into encrypted cyberspace.',
    specs: {
      resonance: '104.2 GHz',
      origin: 'Neural Net X',
      classType: 'Cyber / Infiltration',
    },
    details: {
      backstory: 'Created within the deepest layers of the quantum cybernetic network, Nyx rewrites spatial code to corrupt reality and decrypt matter.',
      ability1: { name: 'Quantum Glitch', desc: 'Disassembles physical matter into binary code before reconstructing it elsewhere.' },
      ability2: { name: 'Null Overdrive', desc: 'Unleashes an electromagnetic pulse that disrupts all electronic and psychic systems.' },
      ability3: { name: 'Cyber Hijack', desc: 'Takes over opponent energy constructs and redirects them with amplified force.' },
      stats: { power: 88, speed: 95, intelligence: 100, durability: 85, energy: 94 },
    },
  },
  {
    id: 'pixar-03',
    slug: 'vortex-sylph',
    name: 'VORTEX SYLPH',
    title: 'THE AERO KINETIC',
    element: 'SONIC TEMPEST',
    themeColor: '#00FF9D',
    accentColor: '#00B4D8',
    bgImage: '/assets/pixar/bg/character3.png',
    characterImage: '/assets/pixar/nobg/character3.png',
    videoUrl: '/assets/pixar/video/character3.mp4',
    frameFolder: '/assets/pixar/frames/character3',
    transparentFrameFolder: '/assets/pixar/frames_transparent/character3',
    frameCount: 96,
    quote: 'Dancing through the slipstream of frictionless kinetic winds.',
    lore: 'Commands supersonic atmospheric currents, maneuvering with zero friction through tempest vortices.',
    specs: {
      resonance: '840 Mach',
      origin: 'Aero Stratos',
      classType: 'Kinetic / Vanguard',
    },
    details: {
      backstory: 'Born from the high-altitude hurricane vortexes of planet Zephyros, Sylph controls pressure waves and sound barriers effortlessly.',
      ability1: { name: 'Sonic Slicer', desc: 'Fires blade-sharp condensed air ripples capable of slicing solid titanium.' },
      ability2: { name: 'Aero Drift', desc: 'Negates air resistance and gravitational pull to achieve Mach 12 velocity.' },
      ability3: { name: 'Tempest Cyclone', desc: 'Conjures a localized atmospheric vortex that draws and neutralizes projectiles.' },
      stats: { power: 86, speed: 100, intelligence: 88, durability: 80, energy: 92 },
    },
  },
  {
    id: 'pixar-04',
    slug: 'ignis-valkyrie',
    name: 'IGNIS VALKYRIE',
    title: 'THE CRIMSON FLAME',
    element: 'PLASMA INFERNO',
    themeColor: '#FF3366',
    accentColor: '#FF6B00',
    bgImage: '/assets/pixar/bg/character4.png',
    characterImage: '/assets/pixar/nobg/character4.png',
    videoUrl: '/assets/pixar/video/character4.mp4',
    frameFolder: '/assets/pixar/frames/character4',
    transparentFrameFolder: '/assets/pixar/frames_transparent/character4',
    frameCount: 96,
    quote: 'Awakening superheated celestial fire with fierce determination.',
    lore: 'Born from subterranean magma veins, emitting concentrated plasma waves that incinerate cosmic debris.',
    specs: {
      resonance: '3,200 °K',
      origin: 'Magma Caldera',
      classType: 'Plasma / Striker',
    },
    details: {
      backstory: 'Forged in subterranean magma currents beneath the core crust, Valkyrie channels volcanic plasma into devastating physical strikes.',
      ability1: { name: 'Inferno Overdrive', desc: 'Ignites surrounding atmosphere into 5,000°C plasma storm.' },
      ability2: { name: 'Crimson Burst', desc: 'Propels explosive volcanic energy bursts with pinpoint precision.' },
      ability3: { name: 'Magma Aegis', desc: 'Hardens molten rock around the body, rendering it impervious to impact.' },
      stats: { power: 100, speed: 89, intelligence: 84, durability: 98, energy: 96 },
    },
  },
  {
    id: 'pixar-05',
    slug: 'nebula-siren',
    name: 'NEBULA SIREN',
    title: 'THE COSMIC HARMONIC',
    element: 'GRAVITY CELESTIAL',
    themeColor: '#D946EF',
    accentColor: '#8B5CF6',
    bgImage: '/assets/pixar/bg/character5.png',
    characterImage: '/assets/pixar/nobg/character5.png',
    videoUrl: '/assets/pixar/video/character5.mp4',
    frameFolder: '/assets/pixar/frames/character5',
    transparentFrameFolder: '/assets/pixar/frames_transparent/character5',
    frameCount: 96,
    quote: 'Resonating across the galactic depths of space and time.',
    lore: 'Synchronizes with deep gravitational frequencies across the universe, creating harmonic ripples that bend cosmic time.',
    specs: {
      resonance: '12.8 Gravitons',
      origin: 'Nebula Rift 05',
      classType: 'Celestial / Harmonic',
    },
    details: {
      backstory: 'A celestial entity born at the intersection of black holes, Siren controls gravitational tides and harmonic resonance frequencies.',
      ability1: { name: 'Gravity Singularity', desc: 'Creates a mini black hole that compresses space and pulls objects toward its center.' },
      ability2: { name: 'Harmonic Pulse', desc: 'Emits cosmic soundwaves that vibrate at the atomic resonance of any material.' },
      ability3: { name: 'Temporal Drift', desc: 'Bends localized spacetime, slowing down incoming attacks to a standstill.' },
      stats: { power: 97, speed: 91, intelligence: 98, durability: 92, energy: 100 },
    },
  },
];
