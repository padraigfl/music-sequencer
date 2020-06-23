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
} from './_constants';

export type PatternStep = {
  note: string;
  span?: number;
} | null;

type PatternSteps = [
  PatternStep, PatternStep, PatternStep, PatternStep,
  PatternStep, PatternStep, PatternStep, PatternStep,
  PatternStep, PatternStep, PatternStep, PatternStep,
  PatternStep, PatternStep, PatternStep, PatternStep,
];

export type Pattern = {
  effects: any[];
  spots: PatternSteps;
  drums: PatternSteps;
};

// TODO make this the standard
export type Pattern16 = [
  PatternSteps, PatternSteps, PatternSteps, PatternSteps,
  PatternSteps, PatternSteps, PatternSteps, PatternSteps,
  PatternSteps, PatternSteps, PatternSteps, PatternSteps,
  PatternSteps, PatternSteps, PatternSteps, PatternSteps,
] & { effects: any[] };

export type ContextState = {
  [PLAY]: boolean;
  [WRITE]: boolean;
  [PATTERN_VIEW]: boolean;
  [SOUNDS_VIEW]: boolean;
  [BPM]: number;
  [VOLUME]: number;
  [SOUND]: number;
  [PATTERNS]: Pattern[];
  [PATTERN_IDX]: number;
  lastNote: string;
  [PATTERN_CHAIN]: number[];
  mutable?: any;
  [PATTERN_TYPE]: string | number;
}

export enum MuteStatus { MUTE_OFF, MUTE_ALL, MUTE_OTHER, MUTE_ME };