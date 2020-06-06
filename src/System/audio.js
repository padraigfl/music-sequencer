import Tone from 'tone';
import { generateInstrument } from './_utils';
import { soundSources } from './_sources';

import {
  PLAY,
  BPM,
  SOUND,
  SOUNDS_SET,
  PATTERNS,
  PATTERN_CHAIN,
  PATTERN_COPY,
  PATTERN_UPDATE,
  NOTE_COPY,
  PATTERN_IDX,
  WRITE,
} from './_constants';

export const sounds = soundSources.map((v, idx) => ({ ...generateInstrument(v), id: idx }));

sounds[0].tone.toMaster();

export class SoundProcessor {
  isPlaying;
  lastSound = 0;
  sound = sounds[0];
  melodySound = sounds[0];
  basicDrum = sounds[15];
  lastState;

  constructor(initialState) {
    this.patterns = initialState[PATTERNS];
    this.sequence = this.sequenceBuilder(initialState[PATTERN_CHAIN]);
  }

  reducer(actionType, state) {
    this.lastState = state; // TODO probably unreliable
    switch(actionType) {
      case PLAY:
        if (Tone.Transport.state !== 'started') {
          Tone.Transport.start();
        }
        this.isPlaying = state[PLAY];
        if (this.isPlaying) {
          this.clearAllLights();
          this.sequence.start();
        } else {
          this.sequence.stop();
          this.clearAllLights();
        }
        return;
      case BPM:
        Tone.Transport.bpm.rampTo(state[BPM], 2);
        return;
      case PATTERN_CHAIN:
        if (this.sequence.state === 'started') {
          this.sequence.stop();
        }
        this.sequence.dispose();
        this.sequence = this.sequenceBuilder(state[PATTERN_CHAIN]);
        if (this.isPlaying) {
          this.sequence.start();
        }
        return;
      case SOUNDS_SET:
        this.sound = sounds[state[SOUND]];
        if (state[SOUND] !== 15) {
          this.melodySound = this.sound;
        }
        this.sound.tone.toMaster();
        return;
      case PATTERN_UPDATE:
      case NOTE_COPY:
      case PATTERN_COPY:
        this.patterns = state[PATTERNS];
        return;
      default:
        return;
    }
  }

  updateLights = (idx, color = 'red', clearLights = true) => {
    const next = document.getElementById(`live-status--${idx % 16}`) 
    if (clearLights || idx % 16 === 0) {
      this.clearLights(color);
    }
    next.classList.add(color);
  }

  clearLights = (color = 'red') => {
    document.querySelectorAll(`[id^=live-status--].${color}`).forEach(v => v.classList.remove(color))
  }

  clearAllLights = () => {
    this.clearLights('red');
    this.clearLights('green');
  }

  sequenceBuilder = (chain) => {
    const baseArray = new Array(16*chain.length).fill({}).map((_, idx) => ({
      patternIdx: chain[Math.floor(idx / 16)],
      noteIdx: idx % 16,
    }));
  
    return new Tone.Sequence(
      (time, { patternIdx, noteIdx }) => {
        this.updateLights(
          noteIdx, 
          'red',
          this.lastState[PATTERN_IDX] === patternIdx && this.lastState[WRITE]
            ? false
            : undefined
        );
        if (noteIdx === 0) {
          this.updateLights(patternIdx, 'green');
        }
        const pattern = this.patterns[patternIdx];
        if (pattern.spots[noteIdx]) {
          const span = pattern.spots[noteIdx].span + 1;
          const bars = Math.floor(span / 16);
          const quarters = (pattern.spots[noteIdx].span + 1) - bars;
          console.log(bars, quarters)
          this.melodySound.tone.triggerAttackRelease(pattern.spots[noteIdx].note, `0:${bars}:${quarters}`);
        }
        if (pattern.drums[noteIdx]) {
          this.basicDrum.tone.triggerAttackRelease(pattern.drums[noteIdx].note)
        }
      },
      baseArray,
      '16n',
    );
  };
}