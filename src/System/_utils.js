import { Tone } from 'tone';

export const PLAY = 'play';
export const WRITE = 'write';
export const PATTERNS = 'patterns';
export const PATTERN_VIEW = 'pattern_view';
export const PATTERN_CHAIN = 'pattern_chain';
export const PATTERN_CHAIN_NEW = 'pattern_chain_new';
export const PATTERN_SET = 'pattern_set';
export const PATTERN_UPDATE = 'pattern_update';
export const PATTERN_COPY = 'pattern_copy';
export const PATTERN_IDX = 'pattern_idx';
export const BPM = 'bpm';
export const VOLUME = 'volume';
export const VOLUME_SET = 'volume_set';
export const SOUND = 'sound';
export const SOUNDS_VIEW = 'sounds_view';
export const SOUNDS_SET = 'sounds_set'
export const CLEAR_VIEW = 'clear_view';
export const CANCEL = 'cancel';
export const SWING_SET = 'swing_set';
export const SWING = 'swing';
export const PATTERN_TYPE = 'patternType';

export const HOLD = 'hold_state';
export const HOLD_ACTION = 'hold_action';
export const HOLD_VALUE = 'hold_value';

export const MULTI_TOUCH = 'multi_touch';

const actionButtons = [
  { id: CANCEL },
  { id: WRITE, isActive: WRITE },
  { id: SOUNDS_VIEW, value: SOUND, secondaryAction: VOLUME },
  { id: PATTERN_VIEW, secondaryAction: 'chain_pattern' },
  { id: BPM, value: BPM },
  { id: PLAY, isActive: PLAY, activeChildren: 'pause' },
];

export const getActionButtons = (state) => actionButtons.map(
  button => ({
    ...button,
    isActive: state[button.isActive],
    value: state[button.value], 
  })
);

export const getCorrectAction = (action, state) => {
  if (!state[HOLD]) {
    return action.type;
  }

  if (state[HOLD] === PATTERN_VIEW) {
    if (action.type === PATTERN_VIEW) {
      return PATTERN_VIEW;
    }
    return PATTERN_CHAIN;
  }

  if (state[HOLD] === SOUNDS_VIEW) {
    if (action.type === SOUNDS_VIEW) {
      return SOUNDS_VIEW;
    }
    return VOLUME;
  }

  if (state[HOLD] === HOLD_PATTERN_IDX) {
    // copy pattern or delete to cancel
    return PATTERN_COPY;
  }
  return action.type;
}

export const getInitialState = ({ mutable } = {}) => ({
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
  [PATTERN_CHAIN]: [0, 1, 2, 3],
  mutable,
  patternType: 'spots',
});

export const updateSingleField = (state, key, value) => {
  return {
    ...state,
    [key]: value,
  };
}

// if working from a base you have limited control of BPM
const getSyncBpmOptions = (base) => [base/4, base/2, base, base * 2, base * 4].filter(v => v > 30 && v < 320);

// iterating through basic bpm options, if there's a base it sticks to times that pair well with it
export const rotateBpm = (value, base) => {
  const options = base ? getSyncBpmOptions(base) :  [80, 100, 120, 140, 320];
  return (options.find(v => v > value) || 80);
}

// Generates instrument for player with title and display properties
export const generateInstrument = ({
  title,
  instrument = Tone.Synth,
  toneParams = [],
  customKeys,
}) => {
  const tone =  new instrument(...toneParams);
  return {
    name: title || tone.toString().split('Synth')[0] || 'Synth',
    tone,
    keys: customKeys,
  }
}

export const updatePatternAtIdx = (state, newPattern, idx) => {
  return [
    ...state[PATTERNS].slice(0, idx),
    newPattern,
    ...state[PATTERNS].slice(idx + 1),
  ];
}

const updateNoteAtIdx = (pattern, newNote, idx) => {
  return [
    ...pattern.slice(0, idx),
    newNote,
    ...pattern.slice(idx + 1),
  ];
};

export const updateNoteInPattern = (state, note, idx) => {
  return [
    ...state[PATTERNS].slice(0, state[PATTERN_IDX]),
    {
      ...state[PATTERNS][state[PATTERN_IDX]],
      [state.patternType]: updateNoteAtIdx(
        state[PATTERN][state.patternType],
        note,
        idx,
      ),
    },
  ]
}
