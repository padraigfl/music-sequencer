import * as Tone from 'tone';
import { generateInstrument } from '../_utils';

import {
  PATTERNS,
  PATTERN_CHAIN,
  PATTERN_IDX,
  WRITE,
  MUTE,
} from '../../Core/_constants';
import { Pattern, ContextState } from '../../Core/_types';
import { Context } from 'vm';
import { instrumentBuildParams, Sound } from '../_types';

(window as any).Tone = Tone;

/**
 * 
 * Contains:
 * - UI considerations
 * - Generic operations
 * 
 * Should note contain:
 * - Sound output considerations
 * - Post-context change reducer
 * - 
 * 
 */

export type StaticValues = {
  startNote?: string;
  sounds: Sound[];
  customState: any;
  customReducer: Object;
  sources: any;
};

export interface ProcessorInterface {
  isPlaying: boolean;
  lastSound: string;
  lastState: Context;
  currentIdx: number;
  currentChain: number[];
  loop: Tone.Loop;

  static: StaticValues;
  sound: Sound[];
  sources: instrumentBuildParams[];
  playerSounds: Sound[];
  patterns: Pattern[];
  patternInterval: any; // timeout
  loopAction: (patternIdx: number, currentIdx: number) => any;
  players?: any[];

  reducer: (action: string, state: ContextState) => void;
  getNewPlaysound: (idx: number) => void;
}

export default class AbstractSoundProcessor implements ProcessorInterface {
  static startNote?: string;
  static sounds: Sound[];
  static customState: any;
  static customReducer: Object;// = {};

  currentIdx = 0;
  currentChain = [];
  isPlaying = false;

  static;
  playerSounds;
  sources;
  patterns;
  sound;
  loop;
  lastState;
  lastSound;
  patternInterval;
  players;

  constructor(initialValues: ContextState, staticValues: StaticValues) {
    this.static = staticValues;
    this.playerSounds = this.static.sounds;
    this.sources = this.static.sources;
    this.patterns = initialValues[PATTERNS];
    this.sound = generateInstrument(this.sources[0]),
    this.playerSounds[0].tone.toMaster();
    this.sound.tone.toMaster();
    Tone.Master.mute = true;
    this.loop = this.loopBuilder();
  }

  reducer(action, state) {
    throw new Error('Classes should define a reducer');
  }

  updateMute() {
    if (this.lastState[MUTE] !== Tone.Master.mute) {
      Tone.Master.mute = this.lastState[MUTE];
      if (!this.lastState[MUTE] && Tone.Transport.state !== 'started') {
        Tone.Transport.start();
      }
    }
  }

  patternFlashing() {
    let idx = 0;
    this.patternInterval = setInterval(() => {
      const duration = this.lastState[PATTERN_CHAIN].length + 1;
      const entry = idx % 2 === 0
        ? this.lastState[PATTERN_CHAIN][(idx / 2) % duration]
        : undefined;
      if (typeof entry !== 'undefined') {
        this.updateLights(
          entry,
          'bgRed',
        );
      } else {
        this.clearLights('bgRed');
      }
      idx++;
    }, 100); 
  }

  stopPatternFlashing() {
    if (this.patternInterval) {
      clearInterval(this.patternInterval);
      this.patternInterval = null;
      this.clearLights('bgRed');
    }
  }

  updateLights = (idx, color = 'red', clearLights = true) => {
    const next = document.getElementById(`live-status--${idx % 16}`) 
    if (clearLights || (idx % 16 === 0 && idx !== 0)) {
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
    this.stopPatternFlashing();
  }

  updateIndex = (newIndex: number) => {
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

  getNewPlaysound(idx) {
    throw new Error("Please implement action in child");
  }

  // means of sequencing multiple players on the one loop... probably gonna be a nightmare
  loopNestAction(parentIdx, parentChain) {
    // TODO
    // calulate the bits and pieces to have the sequences pair consistently
    // return this.loopAction(calculatedPattern, calculatedNote);
  }

  loopAction(currentIdx, noteIdx) {
    throw new Error("Please implement action is child");
  }

  loopBuilder = () => {
    let timeStamp = 0;
    let timesArr = [];
  
    return new Tone.Loop(
      (time) => {
        const derivedIndex = this.currentIdx % (this.currentChain.length * 16);
        const patternIdx = this.currentChain[Math.floor(derivedIndex / 16)];
        const noteIdx = this.currentIdx % 16;

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

        this.loopAction(patternIdx, noteIdx);
        if (this.players) {
          this.players.forEach((player) => {
            player.loopNestAction(this.currentIdx, this.currentChain.length);
          });
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