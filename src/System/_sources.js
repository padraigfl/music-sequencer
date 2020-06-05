import Tone from 'tone';
import DrumMachine from './Instruments/DrumMachine';

export const demoDrum = {
  kick1: 'acoustic-k-1.mp3',
  kick2: 'acoustic-k-2.mp3',
  kick3: 'acoustic-k-3.mp3',
  kick4: 'acoustic-k-4.mp3',
  snare1: 'acoustic-s-1.mp3',
  snare2: 'acoustic-s-2.mp3',
  snare3: 'acoustic-s-3.mp3',
  snare4: 'acoustic-s-4.mp3',
  hat1: 'acoustic-h-1.mp3',
  hat2: 'acoustic-h-2.mp3',
  hat3: 'acoustic-h-3.mp3',
  hat4: 'acoustic-h-4.mp3',
  crash1: 'cr-1.mp3',
  crash2: 'cr-m-1.mp3',
  crash3: 'cr-ml-1.mp3',
  crash4: 'cr-mh-1.mp3',
};

export const pianoSource = [1,2,,3,4,5,6,7,8]
  .reduce((acc, val) => (
    { ...acc, [`C${val}`]: `C${val}.[mp3|ogg]`}
    ), {});

export const soundSources = [
  { instrument: Tone.Synth },
  { instrument: Tone.DuoSynth },
  { instrument: Tone.FMSynth },
  { instrument: Tone.MembraneSynth },
  { instrument: Tone.MetalSynth },
  { instrument: Tone.MonoSynth },
  { instrument: Tone.NoiseSynth },
  { instrument: Tone.PluckSynth },
  { instrument: Tone.PolySynth },
  { instrument: Tone.Synth, title: 'custom1',
    toneParams: [{
      oscillator: {
        type: 'fmsquare',
        modulationType: 'sawtooth',
        modulationIndex: 3,
        harmonicity: 3.4
      },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1
      }
    }],
  },
  { instrument: Tone.Synth, title: 'custom2',
    toneParams: [{
      oscillator: {
        type: 'triangle8'
      },
      envelope: {
        attack: 1,
        decay: 1,
        sustain: 0.4,
        release: 4
      }
    }],
  },
  { instrument: Tone.Synth, title: 'custom3',
    toneParams: [],
  },
  { instrument: Tone.Synth, title: 'custom4',
    toneParams: [],
  },
  { instrument: Tone.Synth, title: 'custom5',
    toneParams: [],
  },
  { instrument: Tone.Sampler, title: 'pianoSampler',
    toneParams: [
      pianoSource,
      { release: 1, baseUrl: "/static/sampler/"}
    ],
  },
  { instrument: DrumMachine, title: 'basicDrum',
    toneParams: [{
      beats: Object.values(demoDrum),
      baseUrl: '/static/demoDrum/',
    }],
    customKeys: Object.keys(demoDrum),
  }
];
  