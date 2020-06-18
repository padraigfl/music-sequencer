import {
  PLAY,
  WRITE,
  BPM,
  SOUND,
  VOLUME,
  SOUNDS_VIEW,
  MUTE,
  PATTERNS,
  PATTERN_VIEW,
  PATTERN_CHAIN,
  PATTERN_TYPE,
  PATTERN_IDX,
} from '../Core/_constants';
import { ContextState, Pattern, PatternStep } from '../Core/_types';


export const getEmptyPattern = () => (
  { spots: new Array(16).fill(null), drums: new Array(16).fill(null), effects: new Array(16).fill(null) }
);

const genericInitialState = {
  [PLAY]: false,
  [WRITE]: false,
  [PATTERN_VIEW]: false,
  [SOUNDS_VIEW]: false,
  [BPM]: 120,
  [VOLUME]: 1,
  [SOUND]: 0,
  [PATTERNS]: new Array(16).fill(getEmptyPattern()),
  [PATTERN_IDX]: 0,
  lastNote: 'C3',
  [PATTERN_CHAIN]: [0, 1],
  [PATTERN_TYPE]: 0,
  [MUTE]: true,
};

const formatPathname = (pathname = '') => (
  pathname.split('/').filter(v => v).slice(0, 2).join('/')
)

const getLocalStorage = (pathname, customState = {}) => {
  const formattedData = {};
  if (!pathname) {
    return formattedData;
  }
  const savedJson = window.localStorage.getItem(
    formatPathname(pathname)
  );

  if (!savedJson) {
    return {};
  }

  const savedState = JSON.parse(savedJson);

  formattedData[PATTERNS] = genericInitialState[PATTERNS].map(
    (v, idx) => savedState[PATTERNS] && savedState[PATTERNS][idx]
      ? savedState[PATTERNS][idx]
      : (customState[PATTERNS] || v)
  );

  [PATTERN_CHAIN, VOLUME, SOUND, PATTERN_TYPE, BPM].forEach(
    (v) => {
      formattedData[v] = savedState[v] || customState[v] || genericInitialState[v];
    }
  );

  return formattedData;
}

export const setLocalStorage = (state: ContextState, locationPathname?: string) => {
  const pathname = locationPathname || window.location.pathname;
  const formattedData = {
    [VOLUME]: state[VOLUME],
    [BPM]: state[BPM],
    [SOUND]: state[SOUND],
    [PATTERN_TYPE]: state[PATTERN_TYPE],
    [PATTERN_CHAIN]: state[PATTERN_CHAIN],
    [PATTERNS]: state[PATTERNS].reduce((acc, val: Pattern, idx) => {
      if (val && Object.entries(val).some(([key, values]) => Array.isArray(values) && values.some(v => !!v))) {
        acc[idx] = val;
      }
      return acc;
    }, {}),
  };
  window.localStorage.setItem(
    formatPathname(pathname),
    JSON.stringify(formattedData),
  );
}



export const getInitialState = (
  { mutable, customState, pathname = '' }:
  { mutable?: any, customState?: any, pathname?: string }
): ContextState => {
  const localStorage = getLocalStorage(pathname, customState);
  console.log(localStorage);
  return {
    ...genericInitialState,
    mutable,
    ...(customState || {}),
    ...localStorage,
  }
};

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
