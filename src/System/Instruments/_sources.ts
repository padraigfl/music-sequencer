import * as Tone from 'tone';
import DrumMachine from './DrumMachine';
import { instrumentBuildParams } from '../_types';

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

export const pianoSource = [1,2,,3,4,5,6,7,8]
  .reduce((acc, val) => (
    { ...acc, [`C${val}`]: `C${val}.[mp3|ogg]`}
    ), {});

export const melodySoundSources: instrumentBuildParams[]  = [
  { instrument: Tone.Synth },
  { instrument: Tone.DuoSynth },
  { instrument: Tone.MembraneSynth },
  { instrument: Tone.MetalSynth },
  { instrument: Tone.MonoSynth },
  { instrument: Tone.MonoSynth, title: 'brasscircuit',
    toneParams: [{
        portamento: 0.01,
        oscillator: {
        type: 'sawtooth'
      },
      filter: {
        Q: 2,
        type: 'lowpass',
        rolloff: -24
      },
      envelope: {
        attack: 0.1,
        decay: 0.1,
        sustain: 0.6,
        release: 0.5
      },
      filterEnvelope: {
        attack: 0.05,
        decay: 0.8,
        sustain: 0.4,
        release: 1.5,
        baseFrequency: 2000,
        octaves: 1.5
      },
    }],
  },
  { instrument: Tone.PluckSynth },
  { instrument: Tone.PolySynth },
  { instrument: Tone.FMSynth },
  { instrument: Tone.FMSynth, title: 'kalimba',
    toneParams: [{
      harmonicity:8,
      modulationIndex: 2,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.001,
        decay: 2,
        sustain: 0.1,
        release: 2
      },
      modulation: {
        type: 'square'
      },
      modulationEnvelope: {
        attack: 0.002,
        decay: 0.2,
        sustain: 0,
        release: 0.2
      }
    }],
  },  // needs updates
  { instrument: Tone.FMSynth, title: 'ecello',
    toneParams: [{
      harmonicity: 3.01,
      modulationIndex: 14,
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.2,
        decay: 0.3,
        sustain: 0.1,
        release: 1.2
      },
      modulation: {
        type: 'square'
      },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.2,
        release: 0.1
      }
    }],
  },
  { instrument: Tone.NoiseSynth },
  { instrument: Tone.Synth, title: 'delicate',
    toneParams: [{
      portamento: 0.0,
      oscillator: {
        type: 'square4'
      },
      envelope: {
        attack: 2,
        decay: 1,
        sustain: 0.2,
        release: 2
      },
    }],
  },
  { instrument: Tone.Synth, title: 'steelpan',
    toneParams: [{
    oscillator: {
      type: 'fatcustom',
      partials: [0.2, 1, 0, 0.5, 0.1],
      spread: 40,
      count: 3
    },
    envelope: {
      attack: 0.001,
      decay: 1.6,
      sustain: 0,
      release: 1.6
    }
  }],
  },
  { instrument: Tone.Sampler, title: 'pianoSampler',
    toneParams: [
    pianoSource,
    { release: 1, baseUrl: '/static/sampler/'}
    ],
  },
];

export const bassSoundSources: instrumentBuildParams[] = melodySoundSources.map((v) => {
  if (v.instrument === Tone.Sampler) {
    return {
      ...v,
      toneParams: [ v.toneParams[0], { ...v.toneParams[1], volume: 15 }],
    };
  }
  return {
    ...v,
    toneParams: Array.isArray(v.toneParams) && v.toneParams.length
      ? [{ ...v.toneParams[0], volume: 15 }, ...v.toneParams.slice(1)]
      : [{ volume: 15}]
  }
});

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

  