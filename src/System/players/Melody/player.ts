import * as Tone from 'tone';
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
  PATTERN_VIEW,
  VOLUME,
} from '../../../Core/_constants';
import AbstractSoundProcessor, { StaticValues, ProcessorInterface } from '../abstractPlayer';
import { Sound } from '../../_types';

interface BasicPlayerInterface extends ProcessorInterface {
  melodySound: Sound;
  basicDrum: Sound;
}

export default class MelodyPlayer extends AbstractSoundProcessor implements BasicPlayerInterface {
  static startNote = 'c3';
  static sources = melodySoundSources;
  static sounds = [
    ...MelodyPlayer.sources.map((v, idx) => ({ ...generateInstrument(v), id: idx })),
    generateDrumMachine(MelodyPlayer.startNote, MelodyPlayer.sources.length),
  ];
  static customState = {
    [PATTERN_TYPE]: 'spots',
  };
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
  melodySound;
  basicDrum;

  constructor(initialState, childStaticValues: StaticValues) {
    super(initialState, { ...MelodyPlayer, ...childStaticValues });

    const playerSounds = childStaticValues?.sounds || MelodyPlayer.sounds;
    this.melodySound = playerSounds[0];
    this.basicDrum = playerSounds[15],
    this.basicDrum.tone.toMaster();
  }


  reducer(actionType, state) {
    this.lastState = state; // TODO probably unreliable

    // todo status lights handler
    if (!this.currentChain.length) {
      this.currentChain = state[PATTERN_CHAIN];
    }
    if (this.patternInterval && this.lastState.view !== PATTERN_VIEW) {
      this.stopPatternFlashing();
    } else if (!this.patternInterval && this.lastState.view === PATTERN_VIEW && !this.lastState[PLAY]) {
      this.patternFlashing();
    }

    switch(actionType) {
      case PLAY:
        this.stopPatternFlashing();
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
        this.sound.tone.dispose();
        this.sound = newPlaySound;

        if (state[SOUND] !== 15) {
          const melodySound = this.playerSounds[state[SOUND]];
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
      case VOLUME:
        this.melodySound.tone.volume.value = state[VOLUME];
        this.sound.tone.volume.value = state[VOLUME];
      case MUTE:
        this.updateMute();
        return;
      default:
        return;
    }
  }

  getNewPlaysound = (idx) => {
    let newPlaySound = idx < 15
      ? generateInstrument(this.static.sources[idx])
      : generateDrumMachine(this.static.startNote, idx);

    newPlaySound.tone.toMaster();

    if (idx < 15) {
      newPlaySound.tone.volume.value = this.lastState[VOLUME];
    }
    return newPlaySound;
  }

  loopAction(patternIdx, noteIdx) {
    const pattern = this.patterns[patternIdx];
    if (pattern.spots[noteIdx]) {
      const span = pattern.spots[noteIdx].span + 1;
      const bars = Math.floor(span / 16);
      const quarters = (pattern.spots[noteIdx].span + 1) - bars;
      this.melodySound.tone.triggerAttackRelease(pattern.spots[noteIdx].note, `0:${bars}:${quarters}`);
    }
    if (pattern.drums[noteIdx]) {
      this.basicDrum.tone.triggerAttackRelease(pattern.drums[noteIdx].note)
    }
  }
}