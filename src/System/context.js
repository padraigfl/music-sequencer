import React, {
  createContext,
  useCallback,
  useReducer,
  useRef,
  useEffect,
  useMemo,
} from 'react';

import Tone from 'tone';
import {
  getInitialState,
  rotateBpm,
  updatePatternAtIdx,
  updateNoteInPattern,
} from './_utils';

import {
  PLAY,
  WRITE,
  BPM,
  SWING_SET,
  SWING,
  SOUND,
  VOLUME,
  SOUNDS_VIEW,
  SOUNDS_SET,
  PATTERNS,
  PATTERN_VIEW,
  PATTERN_CHAIN,
  PATTERN_CHAIN_NEW,
  PATTERN_SET,
  PATTERN_COPY,
  PATTERN_IDX,
  PATTERN_UPDATE,
  NOTE_COPY,
  PATTERN_TYPE,
  CLEAR_VIEW,
  CANCEL,
  MULTI_TOUCH,
} from './_constants';

import { sounds, SoundProcessor } from './audio';

window.Tone = Tone;


const playerContext = createContext({});

const clearChainTimeout = ref => {
  if (ref.current) {
    clearTimeout(ref.current);
  }
  ref.current = null;
}

const viewHandler = (view) => ({ view });

const isInRange = (val) => typeof val === 'number' && val >= 0 && val < 17;

const getValueFromDataset = dataset => (
  dataset && typeof(dataset.value) !== 'undefined'
    ? dataset.value
    : undefined
);

const multiTouchAction = (derivedAction, state, values = []) => {
  switch(derivedAction) {
    case VOLUME:
      return isInRange(value)
        ? { [VOLUME]: value }
        : {};
    case SWING_SET:
      return isInRange(value)
        ? { [SWING]: value }
        : {};
    case PATTERN_COPY:
      let value1 = getValueFromDataset(values[0]);
      let value2 = getValueFromDataset(values[1]);
      return isInRange(value1) && isInRange(value2)
        ? {
          [PATTERNS]: updatePatternAtIdx(
            state,
            state[PATTERNS][value1],
            state[PATTERNS][value2],
          ),
          [WRITE]: true,
          [PATTERN_IDX]: value2,
          view: null,
        }
        : {};
    case NOTE_COPY:
      let note1 = getValueFromDataset(values[0]);
      let note2 = getValueFromDataset(values[1]);
      return isInRange(note1) && isInRange(note2)
        ? {
          [PATTERNS]: updateNoteInPattern(
            state,
            state[PATTERNS][state[PATTERN_IDX]][state[PATTERN_TYPE]][note1],
            note2,
          ),
        }
        : {};
    case PATTERN_CHAIN:
      if (values.length === 1) {
        return { [PATTERN_CHAIN_NEW]: true, view: PATTERN_VIEW };
      }
      const value = getValueFromDataset(values[1]);
      if (typeof value === 'undefined') {
        return {};
      }
      return {
        [PATTERN_CHAIN_NEW]: false,
        [PATTERN_CHAIN]: state[PATTERN_CHAIN_NEW]
          ? [value]
          : [...state[PATTERN_CHAIN], value]
      };
    default:
      return {};
  }
};

const actionHandler = {
  [PLAY]: state =>({ [PLAY]: !state[PLAY] }),
  [WRITE]: state => ({ [WRITE]: !state[WRITE], ...viewHandler(state[WRITE] ? state.view : null) }),
  [CLEAR_VIEW]: () => ({ view: null }),
  [SOUNDS_VIEW]: state => viewHandler(state.view !== SOUNDS_VIEW ? SOUNDS_VIEW : null),
  [SOUNDS_SET]: (state, value) => ({
    view: state[WRITE] ? WRITE : null,
    [SOUND]: value,
    patternType: +value === 15 ? 'drums' : 'spots',
  }),
  [PATTERN_VIEW]: state => viewHandler(state.view !== PATTERN_VIEW ? PATTERN_VIEW : null ),
  [PATTERN_SET]: (state, value) => ({
    [PATTERN_IDX]: value,
    [WRITE]: true,
    view: state[WRITE] || null,
  }),
  [PATTERN_CHAIN]: (state, { idx, append }) => {
    if (state[WRITE]) {
      return { [PATTERN_IDX]: idx, view: WRITE };
    }
    return {
      [PATTERN_CHAIN]: append ? [...state[PATTERN_CHAIN], idx ] : [idx],
    };
  },
  [BPM]: (state, value) => ({ [BPM]: value ? value : rotateBpm(state[BPM]) }),
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
  [MULTI_TOUCH]: (state, value) => {
    const action = value && value[0] ? value[0].secondary : null;
    return {
      ...multiTouchAction(action, state, value),
     lastAction: action,
    };
  },
  // cancel needs it's own series of operations
  [CANCEL]: () => ({
  }),
}

const reducer = (state, action) => {
  if (state.mutable.chainTimer.current && (
    [ SOUNDS_VIEW, CLEAR_VIEW, PATTERN_VIEW ].includes(action.type)
    || state[WRITE]
  )) {
    clearChainTimeout(state.mutable.chainTimer);
  }

  let stateChanges = actionHandler[action.type] ? actionHandler[action.type](state, action.value) : {};

  let newState = {
    ...state,
    ...stateChanges,
    lastAction: stateChanges.lastAction  || action.type,
  };
  return newState;
}

export const ToneProvider = (props) => {
  const chainTimer = useRef(null);
  const initialState = useMemo(() => getInitialState({
    mutable: { chainTimer },
  }), [])
  const soundProcessor = useRef(new SoundProcessor(initialState));
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    soundProcessor.current.reducer(state.lastAction, state);
  }, [state])

  const synthAction = useCallback((note, action = 'release', length) => {
    console.log(state[SOUND], note, action);
    switch(action) {
      case 'attack':
        soundProcessor.current.sound.tone.triggerAttackRelease(note, length);
        return;
      default: 
        soundProcessor.current.sound.tone.triggerRelease();
        return;
    }
  }, [state[SOUND]]);

  return (
    <playerContext.Provider
      value={{
        state,
        dispatch,
        synthAction,
        sounds,
      }}
    >
      {props.children}
    </playerContext.Provider>
  )
}

export default playerContext;