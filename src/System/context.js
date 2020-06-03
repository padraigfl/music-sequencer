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
  PLAY,
  WRITE,
  PATTERNS,
  BPM,
  VOLUME,
  SOUND,
  rotateBpm,
  updateSingleField,
  SOUNDS_SET,
  SOUNDS_VIEW,
  PATTERN_UPDATE,
  PATTERN_VIEW,
  PATTERN_CHAIN,
  PATTERN_IDX,
  PATTERN_SET,
  CLEAR_VIEW,
  HOLD,
  HOLD_ACTION,
  HOLD_VALUE,
  CANCEL,
} from './_utils';
import { sounds, SoundProcessor } from './sound';
import { useMultiTouch } from '../Interface/_utils';

window.Tone = Tone;


const playerContext = createContext({});

const clearChainTimeout = ref => {
  if (ref.current) {
    clearTimeout(ref.current);
  }
  ref.current = null;
}

const viewHandler = (view) => ({ view });

const actionHandler = {
  [PLAY]: state =>({ [PLAY]: !state[PLAY] }),
  [WRITE]: state => ({ [WRITE]: !state[WRITE], ...viewHandler(state.view === WRITE ? !state[WRITE] : state.view) }),
  [CLEAR_VIEW]: () => ({ view: null }),
  [VOLUME]: () => updateSingleField(state, action.type, action.value),
  [SOUNDS_VIEW]: state => viewHandler(state.view !== SOUNDS_VIEW ? SOUNDS_VIEW : null),
  [SOUNDS_SET]: (state, value) => ({
    view: state[WRITE] ? WRITE : null,
    [SOUND]: value,
    patternType: +value === 15 ? 'drums' : 'spots',
  }),
  [PATTERN_VIEW]: state => viewHandler(state.view !== PATTERN_VIEW ? PATTERN_VIEW : null ),
  [PATTERN_SET]: (state, value) => ({
    [PATTERN_IDX]: value,
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
  [HOLD]: (state, { action, value }) => {
    if (state[HOLD] !== action) {
      return { [HOLD]: action, [HOLD_VALUE]: value };
    }
    console.log(HOLD_ACTION, state[HOLD], state[HOLD_VALUE], value);
    return { [HOLD]: null, [HOLD_VALUE]: null};
  },
  [HOLD_ACTION]: (state, value) => {
    console.log(HOLD_ACTION, state[HOLD], state[HOLD_VALUE], value);
    return { [HOLD]: null, [HOLD_VALUE]: null};
  },
  [CANCEL]: () => ({
    [HOLD]: null,
    [HOLD_VALUE]: null,
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
    lastAction: action.type,
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