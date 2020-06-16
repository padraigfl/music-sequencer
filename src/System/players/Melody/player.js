import Tone from 'tone';
import { generateInstrument } from '../../_utils';
import { melodySoundSources } from './sources';
import { generateDrumMachine } from '../../Instruments/_sources';

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
  MUTE,
} from '../../../Core/_constants';

window.Tone = Tone;

export default class SoundProcessor {
  static startNote = 'c3';
  static sounds = [
    ...melodySoundSources.map((v, idx) => ({ ...generateInstrument(v), id: idx })),
    generateDrumMachine(this.startNote, melodySoundSources.length),
  ];

  static customState = {
    [PATTERN_TYPE]: 'spots',
  };

  // only allows two sound settings at a time, one of which is always the drums
  static customReducer = {
    [SOUNDS_SET]: (state, value) => ({
      view: state[WRITE] ? WRITE : null,
      [SOUND]: value,
      [PATTERN_TYPE]: +value === 15 ? 'drums' : 'spots',
    }),
    [PATTERN_UPDATE]: (state, {idx, note, span }) => {
      const lastKey = state[SOUND] === 15 ? 'lastBeat' : 'lastNote';
      const activePattern = state[PATTERNS][state[PATTERN_IDX]];
      const updatedPatterns = [
        ...state[PATTERNS].slice(0, state[PATTERN_IDX]),
        {
          ...activePattern,
          [state[PATTERN_TYPE]]: [
            ...activePattern[state[PATTERN_TYPE]].slice(0, idx),
            note ? { note, span } : null,
            ...activePattern[state[PATTERN_TYPE]].slice(idx + 1),
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
  lastState;
  currentIdx = 0;
  currentChain = [];
  loop;

  constructor(initialState) {
    this.startNote = SoundProcessor.startNote
    this.playerSounds = SoundProcessor.sounds;
    this.sound = generateInstrument(melodySoundSources[0]);
    this.melodySound = this.playerSounds[0];
    this.basicDrum = this.playerSounds[15];
    this.patterns = initialState[PATTERNS];
    this.instantiate();
  }

  instantiate() {
    this.playerSounds[0].tone.toMaster();
    this.loop = this.loopBuilder();
    this.sound.tone.toMaster();
    this.basicDrum.tone.toMaster();
    Tone.Master.mute = true;
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
          const melodySound = this.playerSounds[state[SOUND]];
          melodySound.tone.toMaster();
          this.melodySound.tone.disconnect();
          this.melodySound = melodySound;
        }
        return;
      case MUTE:
        this.updateMute();
      case PATTERN_UPDATE:
      case NOTE_COPY:
      case PATTERN_COPY:
        this.patterns = state[PATTERNS];
        return;
      default:
        return;
    }
  }

  updateMute() {
    if (this.lastState[MUTE] !== Tone.Master.mute) {
      Tone.Master.mute = this.lastState[MUTE];
      if (!this.lastState[MUTE] && Tone.Transport.state !== 'started') {
        Tone.Transport.start();
      }
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
          this.melodySound.tone.triggerAttackRelease(pattern.spots[noteIdx].note, `0:${bars}:${quarters}`);
          console.log(derivedIndex);
          console.log(noteIdx);
        }
        if (pattern.drums[noteIdx]) {
          this.basicDrum.tone.triggerAttackRelease(pattern.drums[noteIdx].note)
        }

        this.updateIndex(this.currentIdx);
      },
      '16n',
    );
  };

  unmount()  {
    if (this && this.loop) {
      this.loop.stop();
      this.clearAllLights();
    }
  }
}