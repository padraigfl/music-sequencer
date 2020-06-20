import DrumMachine from './DrumMachine';

type drumSamples = {
  name: string;
  src: string;
  volume?: number;
};

export const demoDrum: drumSamples[] = [
  { name: 'kick1', src: 'acoustic-k-1.mp3' },
  { name: 'kick2', src: 'CYCdh_Kurz08-Kick01.[ogg|mp3]' },
  { name: 'tom1', src: 'CYCdh_Kurz08-Tom02.[ogg|mp3]', volume: 2 },
  { name: 'tom2', src: 'CYCdh_Kurz08-Tom04.[ogg|mp3]', volume: 2 },
  { name: 'snare1', src: 'acoustic-s-1.mp3' },
  { name: 'snare2', src: 'CYCdh_Kurz08-Snr01.[ogg|mp3]' },
  { name: 'sdSt', src: 'CYCdh_Kurz08-SdSt02.[ogg|mp3]' },
  { name: 'scratch', src: 'CYCdh_Kurz08-Scratch02.[ogg|mp3]' },
  { name: 'hat1', src: 'acoustic-h-1.mp3', volume: 20 },
  { name: 'hat2', src: 'acoustic-h-2.mp3' },
  { name: 'pdHat', src: 'CYCdh_Kurz08-PdHat.[ogg|mp3]' },
  { name: 'opHat', src: 'CYCdh_Kurz08-OpHat.[ogg|mp3]' },
  { name: 'clap', src: 'CYCdh_Kurz08-clap.[ogg|mp3]' },
  { name: 'crash', src: 'CYCdh_Kurz08-Crash01.[ogg|mp3]' },
  { name: 'perc1', src: 'CYCdh_Kurz08-Perc01.[ogg|mp3]' },
  { name: 'perc3', src: 'CYCdh_Kurz08-Perc04.[ogg|mp3]' },
];

export const generateDrumMachine = (startNote = 'c3', idx?: number, baseVolume = 1) => {
  return {
    name: 'basicDrum',
    tone: new DrumMachine({
      sources: demoDrum,
      baseUrl: '/static/demoDrum/',
      startNote,
      baseVolume,
    }),
    keys: demoDrum.map(({ name }) => name),
    idx,
  };
};

  