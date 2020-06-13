import Tone from 'tone';
import { generateInstrument } from '../_utils';
import { melodySoundSources, generateDrumMachine } from '../_sources';

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
  PATTERN_TYPE,
} from '../_constants';

export class SoundProcessor {
  static startNote = 'c1';
  static sounds = [
    ...melodySoundSources.map((v, idx) => ({ ...generateInstrument(v), id: idx })),
    generateDrumMachine(SoundProcessor.startNote, melodySoundSources.length),
  ];

  static customReducer = {
    [SOUNDS_SET]: (state, value) => ({
      view: state[WRITE] ? WRITE : null,
      [SOUND]: value,
      [PATTERN_TYPE]: +value === 15 ? 'drums' : 'spots',
    }),
    [PATTERN_UPDATE]: (state, {idx, note, span }) => {
      const lastKey = state[SOUND] === 15 ? 'lastBeat' : 'lastNote';
      const activePattern = state[PATTERNS][state[PATTERN_IDX]];
      console.log(activePattern[state.patternType].slice(0, idx));
      console.log(activePattern[state.patternType].slice(idx + 1));
      console.log(idx);
      const updatedPatterns = [
        ...state[PATTERNS].slice(0, state[PATTERN_IDX]),
        {
          ...activePattern,
          [state.patternType]: [
            ...activePattern[state.patternType].slice(0, idx),
            note ? { note, span } : null,
            ...activePattern[state.patternType].slice(idx + 1),
          ],
        },
        ...state[PATTERNS].slice(state[PATTERN_IDX] + 1),
      ];
      return {
        [PATTERNS]: updatedPatterns,
        [lastKey]: note || state[lastKey],
      };
    },
  };

  isPlaying;
  lastSound = 0;
  sound = generateInstrument(melodySoundSources[0]);
  melodySound = SoundProcessor.sounds[0];
  basicDrum = SoundProcessor.sounds[15];
  lastState;
  currentIdx = 0;
  currentChain = [];
  loop;

  constructor(initialState) {
    SoundProcessor.sounds[0].tone.toMaster();
    this.patterns = initialState[PATTERNS];
    this.loop = this.loopBuilder();
    this.sound.tone.toMaster();
    this.basicDrum.tone.toMaster();
  }

  reducer(actionType, state) {
    this.lastState = state; // TODO probably unreliable
    console.log(this.sound.name)
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
      case SOUNDS_SET:
        if (state[SOUND] === this.sound.idx) {
          return;
        } 
        const newPlaySound = this.getNewPlaysound(state[SOUND]);
        this.sound.tone.disconnect();
        this.sound = newPlaySound;

        if (state[SOUND] !== 15) {
          const melodySound = SoundProcessor.sounds[state[SOUND]];
          melodySound.tone.toMaster();
          this.melodySound.tone.disconnect();
          this.melodySound = melodySound;
        }
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

  getNewPlaysound = (idx) => {
    let newPlaySound = idx < 15
      ? generateInstrument(melodySoundSources[idx])
      : generateDrumMachine(SoundProcessor.startNote, idx);

    newPlaySound.tone.toMaster();
    return newPlaySound;
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