export interface EnemyData {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  image: string;
  themeColor: string;
  attackIntervalMs: number;
  attackDamage: number;
}

export const TYPING_ENEMIES: EnemyData[] = [
  {
    id: 'enemy-1',
    name: 'VOID GLITCHER',
    title: 'CORRUPTED DATA PARASITE',
    maxHp: 800,
    image: '👾',
    themeColor: '#A855F7',
    attackIntervalMs: 4000,
    attackDamage: 12,
  },
  {
    id: 'enemy-2',
    name: 'MAGMA COLOSSUS',
    title: 'CORE CRUST BEHEMOTH',
    maxHp: 1500,
    image: '👹',
    themeColor: '#EF4444',
    attackIntervalMs: 3500,
    attackDamage: 16,
  },
  {
    id: 'enemy-3',
    name: 'CHRONO LEVIATHAN',
    title: 'UNIVERSAL VOID DESTROYER',
    maxHp: 2400,
    image: '🐉',
    themeColor: '#06B6D4',
    attackIntervalMs: 3000,
    attackDamage: 22,
  },
];

export const CHARACTER_WORDS: Record<string, string[]> = {
  'pixar-01': [
    'SOLAR', 'LIGHT', 'PHOTON', 'RADIANCE', 'STARS', 'AURORA', 'LUMEN', 'BEAM',
    'CRYSTAL', 'SPECTRUM', 'FLASH', 'GLOW', 'PRISM', 'ETERNAL', 'DAYLIGHT', 'BRILLIANT',
    'SUPERNOVA', 'HYPERION', 'HELIOS', 'IGNITE', 'CELESTIAL', 'SOLARFLARE'
  ],
  'pixar-02': [
    'CYBER', 'QUANTUM', 'VOID', 'MATRIX', 'GLITCH', 'CIPHER', 'SYNTAX', 'BINARY',
    'ENCRYPT', 'DECRYPT', 'PULSE', 'VECTOR', 'OVERDRIVE', 'INFILTRATE', 'NEURAL',
    'PROTOCOL', 'MAINFRAME', 'HIJACK', 'FIREWALL', 'TELEPORT', 'SYSTEMCRASH'
  ],
  'pixar-03': [
    'TEMPEST', 'VORTEX', 'AERO', 'SONIC', 'CYCLONE', 'BREEZE', 'TYPHOON', 'SLIPSTREAM',
    'PRESSURE', 'GUST', 'HURRICANE', 'FRICTIONLESS', 'VELOCITY', 'TACTICAL', 'ZEPHYR',
    'SUPERSONIC', 'TORNADO', 'AIRSTRIKE', 'TURBULENCE', 'SOUNDBARRIER'
  ],
  'pixar-04': [
    'INFERNO', 'PLASMA', 'MAGMA', 'VALKYRIE', 'ERUPT', 'CRIMSON', 'VOLCANO', 'CALDERA',
    'BURST', 'BLAZE', 'SCORCH', 'METEOR', 'SUPERHEAT', 'STRIKE', 'MOLTEN', 'ASHES',
    'THERMAL', 'DESTRUCTION', 'FURNACE', 'FIRESTORM', 'SOLARIS'
  ],
  'pixar-05': [
    'NEBULA', 'GRAVITY', 'SINGULARITY', 'COSMIC', 'HARMONIC', 'RESONANCE', 'GALAXY',
    'TIMEWARP', 'PULSAR', 'QUASAR', 'DIMENSION', 'CELESTIAL', 'ECLIPSE', 'HORIZON',
    'ORBIT', 'GRAVITON', 'WORMHOLE', 'STARLIGHT', 'SUPERCLUSTER', 'BLACKHOLE'
  ],
};
