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

export type Pattern = {
  effects: any[];
  spots: PatternStep[];
  drums: PatternStep[];
};

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
