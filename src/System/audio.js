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
  currentIdx = 0;
  currentChain = [];
  loop;

  constructor(initialState) {
    this.patterns = initialState[PATTERNS];
    this.loop = this.loopBuilder();
  }

  reducer(actionType, state) {
    this.lastState = state; // TODO probably unreliable
    if (!this.currentChain.length) {
      this.currentChain = state[PATTERN_CHAIN];
    }
    switch(actionType) {
      case PLAY:
        if (Tone.Transport.state !== 'started') {
          Tone.Transport.start();
        }
        this.isPlaying = state[PLAY];
        if (this.isPlaying) {
          this.clearAllLights();
          this.loop.start();
        } else {
          this.loop.stop();
          this.currentIdx = 0;
          this.clearAllLights();
        }
        return;
      case BPM:
        Tone.Transport.bpm.rampTo(state[BPM], 2);
        return;
      // case PATTERN_CHAIN:
      //   const sequenceStarted = this.loop && this.loop.state === 'started';
      //   if (!sequenceStarted) {
      //     this.currentChain = state[PATTERN_CHAIN];
      //   }
      //   if (this.isPlaying) {
      //     this.loop.start();
      //   }
      //   return;
      case SOUNDS_SET:
        this.sound = sounds[state[SOUND]];
        if (state[SOUND] !== 15) {
          this.melodySound.tone.disconnect();
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


  updateIndex = (newIndex) => {
    this.currentIdx = newIndex;
    if (
      this.currentIdx % 16 === 0
    ) {
      const hasUpdatedChain = this.lastState[PATTERN_CHAIN] !== this.currentChain;
      const chainLengthChanged = hasUpdatedChain
        && this.lastState[PATTERN_CHAIN].length !== this.currentChain.length;
      if (hasUpdatedChain) {
        this.currentChain = this.lastState[PATTERN_CHAIN];
      }
      if (chainLengthChanged) {
        this.currentIdx = 0;
      }
    }
  }

  loopBuilder = () => {
    let timeStamp = 0;
    window.timesArr = [];
  
    return new Tone.Loop(
      (time) => {
        const derivedIndex = this.currentIdx % (this.currentChain.length * 16);
        const patternIdx = this.currentChain[Math.floor(derivedIndex / 16)];
        const noteIdx = this.currentIdx % 16;
        const pattern = this.patterns[patternIdx];

        timeStamp = time - timeStamp;
        timesArr = [...timesArr, timeStamp];
        this.currentIdx += 1;

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

        this.updateIndex(this.currentIdx);
      },
      '16n',
    );
  };
}