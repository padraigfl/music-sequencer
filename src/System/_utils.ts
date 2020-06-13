import Tone from 'tone';

import {
  PLAY,
  WRITE,
  BPM,
  SOUND,
  VOLUME,
  SOUNDS_VIEW,
  PATTERNS,
  PATTERN_VIEW,
  PATTERN_CHAIN,
  PATTERN_TYPE,
  PATTERN_IDX,
  NOTES,
} from './_constants';
import { ContextState, Pattern, PatternStep, instrumentBuildParams, keyData } from './_types';

export const generateKeys = (start: number = 3): keyData[] => {
  const sounds = [];
  for (let i = 0; i < 16; i++) {
    sounds.push({ id: `${NOTES[i % 7]}${start + Math.floor(i / 7)}`});
  }
  return sounds;
};

export const generateInstrument = ({
  title,
  instrument = Tone.Synth,
  toneParams = [],
  customKeys,
  idx,
}: instrumentBuildParams) => {
  const tone =  new instrument(...toneParams);
  return {
    name: title || tone.toString().split('Synth')[0] || 'Synth',
    tone,
    keys: customKeys,
    idx,
  }
}

export const getInitialState = ({ mutable }: { mutable?: any } = {}): ContextState => ({
  [PLAY]: false,
  [WRITE]: false,
  [PATTERN_VIEW]: false,
  [SOUNDS_VIEW]: false,
  [BPM]: 120,
  [VOLUME]: 1,
  [SOUND]: 0,
  [PATTERNS]: new Array(16).fill({ spots: new Array(16).fill(null), drums: new Array(16).fill(null), effects: {} }),
  [PATTERN_IDX]: 0,
  lastNote: 'C3',
  [PATTERN_CHAIN]: [0, 1],
  mutable,
  patternType: 'spots',
});

// if working from a base you have limited control of BPM
const getSyncBpmOptions = (base: number): number[] => [base/4, base/2, base, base * 2, base * 4].filter(v => v > 30 && v < 320);

// iterating through basic bpm options, if there's a base it sticks to times that pair well with it
export const rotateBpm = (value: number, base?: number): number => {
  const options = base ? getSyncBpmOptions(base) :  [80, 100, 120, 140, 320];
  return (options.find(v => v > value) || 80);
}

export const updatePatternAtIdx = (state: ContextState, newPattern: Pattern, idx: number) => {
  return [
    ...state[PATTERNS].slice(0, idx),
    newPattern,
    ...state[PATTERNS].slice(idx + 1),
  ];
}

export const updateNoteInPattern = (state: ContextState, note: PatternStep, idx: number) => {
  const pattern = state[PATTERNS][state[PATTERN_IDX]];
  const patternPart = pattern[state[PATTERN_TYPE]];
  return [
    ...state[PATTERNS].slice(0, state[PATTERN_IDX]),
    {
      ...pattern,
      [state[PATTERN_TYPE]]: [
        ...patternPart.slice(0, idx),
        note,
        ...patternPart.slice(idx + 1),
      ],
    },
    ...state[PATTERNS].slice(state[PATTERN_IDX] + 1),
  ];
}
