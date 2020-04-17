export const PLAY = 'play';
export const WRITE = 'write';
export const PATTERNS = 'patterns';
export const PATTERN_VIEW = 'pattern_view';
export const PATTERN_CHAIN = 'pattern_chain';
export const PATTERN_SET = 'pattern_set';
export const PATTERN_UPDATE = 'pattern_update';
export const PATTERN_IDX = 'pattern_idx';
export const BPM = 'bpm';
export const VOLUME = 'volume';
export const SOUND = 'sound';
export const SOUNDS_VIEW = 'sounds_view';
export const SOUNDS_SET = 'sounds_set'
export const CLEAR_VIEW = 'clear_view';

export const getInitialState = ({ sounds, mutable }) => ({
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
  [PATTERN_CHAIN]: [0],
  mutable,
});

export const updateSingleField = (state, key, value) => {
  return {
    ...state,
    [key]: value,
  };
}

const getSyncBpmOptions = (base) => [base/4, base/2, base, base * 2, base * 4].filter(v => v > 30 && v < 320);

export const rotateBpm = (value, base) => {
  const options = base ? getSyncBpmOptions(base) :  [80, 100, 120, 140, 320];
  return (options.find(v => v > value) || 80);
}
