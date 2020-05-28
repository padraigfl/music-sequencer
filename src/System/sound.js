import Tone from 'tone';
import { PATTERN_CHAIN, PLAY, SOUND, generateInstrument, SOUNDS_SET, PATTERNS, BPM, PATTERN_UPDATE } from './_utils';
import { DrumMachine } from '../tools/_player';

const demoDrum = {
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

export const sounds = [
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
    toneParams: [{
      "C1" : "C1.[mp3|ogg]",
      "C2" : "C2.[mp3|ogg]",
      "C3" : "C3.[mp3|ogg]",
      "C4" : "C4.[mp3|ogg]",
      "C5" : "C5.[mp3|ogg]",
      "C6" : "C6.[mp3|ogg]",
      "C7" : "C7.[mp3|ogg]",
      "C8" : "C8.[mp3|ogg]"
    }, {
      "release" : 1,
      "baseUrl" : "/static/sampler/"
    }],
  },
  { instrument: DrumMachine, title: 'basicDrum',
    toneParams: [{
      beats: Object.values(demoDrum),
      baseUrl: '/static/demoDrum/',
    }],
    customKeys: Object.keys(demoDrum),
  }
].map((v, idx) => ({ ...generateInstrument(v), id: idx }));

sounds[0].tone.toMaster();

export class SoundProcessor {
  isPlaying;
  lastSound = 0;
  sound = sounds[0];

  constructor(initialState) {
    this.patterns = initialState[PATTERNS];
    this.sequence = this.sequenceBuilder(initialState[PATTERN_CHAIN]);
  }

  reducer(actionType, value) {
    switch(actionType) {
      case PLAY:
        this.isPlaying = value;
        if (value) {
          this.sequence.start();
        } else {
          this.sequence.stop();
        }
        return;
      case BPM:
        this.bpm.rampTo(value, 2);
        return;
      case PATTERN_CHAIN:
        this.sequence.stop();
        this.sequence.dispose();
        this.sequence = sequenceBuilder(value);
        if (this.isPlaying) {
          this.sequence.start();
        }
        return;
      case SOUNDS_SET:
        if (value !== 15) {
          this.sound = sounds[value];
        }
        sounds[value].tone.toMaster();
        return;
      case PATTERN_UPDATE:
        this.patterns = value;
        return;
    }
  }

  updateLights = (idx, color = 'red') => {
    const prev = document.getElementById(`live-status--${(idx + 15) % 16}`)
    const next = document.getElementById(`live-status--${idx % 16}`)
    prev.classList.remove(color);
    next.classList.add(color);
  }

  sequenceBuilder = (chain) => {
    const baseArray = new Array(16*chain.length).fill({}).map((_, idx) => ({
      patternIdx: chain[Math.floor(idx / 16)],
      noteIdx: idx % 16,
    }));
  
    return new Tone.Sequence(
      (time, { patternIdx, noteIdx }) => {
        this.updateLights(noteIdx);
        const pattern = this.patterns[patternIdx];
        if (pattern.spots[noteIdx]) {
          this.sound.tone.triggerAttackRelease(pattern.spots[noteIdx].note, '4n');
        }
        if (pattern.drums[noteIdx]) {
          sounds[15].tone.triggerAttackRelease(pattern.drums[noteIdx].note)
        }
      },
      baseArray,
      '16n',
    );
  };
}