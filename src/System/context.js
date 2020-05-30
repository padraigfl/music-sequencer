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
} from './_utils';
import { sounds, SoundProcessor } from './sound';

const playerContext = createContext({});

// @todo more complex overwrites passed in by context?
const updatePattern = (pattern, updateData, lastNote, key = 'spots') => {
  const { note = lastNote, span, idx } = updateData;
  const currentVal = pattern[key][idx];
  return {
    ...pattern,
    [key]: [
      ...pattern[key].slice(0, idx),
      currentVal && currentVal.note && !updateData.note ? null : { note, span },
      ...pattern[key].slice(idx + 1),
    ],
  }
};

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
  [PATTERN_SET]: (state, value) => ({ [PATTERN_IDX]: value }),
  [PATTERN_CHAIN]: (state, { idx, append }) => {
    if (state[WRITE]) {
      return { [PATTERN_IDX]: idx, view: WRITE };
    }
    return {
      [PATTERN_CHAIN]: append ? [...state[PATTERN_CHAIN], idx ] : [idx],
    };
  },
  [BPM]: (state, value) => ({ [BPM]: value ? value : rotateBpm(state[BPM]) }),
  [PATTERN_UPDATE]: (state, { update, idx }) => {
    const patternIdx = idx || state[PATTERN_IDX];
    const lastKey = state[PATTERN_IDX] === 15 ? 'lastBeat' : 'lastNote';
    const updatedPatterns = [
      ...state[PATTERNS].slice(0, patternIdx),
      updatePattern(
        state[PATTERNS][patternIdx],
        update,
        state.lastNote,
        state.patternType,
      ),
      ...state[PATTERNS].slice(patternIdx + 1),
    ];
    return {
      [PATTERNS]: updatedPatterns,
      [lastKey]: update.note || state[lastKey],
    };
  },
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

const chainTimeout = dispatch => setTimeout(() => {
  dispatch({ type: PATTERN_VIEW }); 
}, 3000);

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
  }, [state.lastAction])

  const synthAction = useCallback((note, action = 'release') => {
    console.log(state[SOUND], note, action);
    switch(action) {
      case 'attack':
        soundProcessor.current.sound.tone.triggerAttackRelease(note);
        return;
      default: 
        soundProcessor.current.sound.tone.triggerRelease();
        return;
    }
  }, [state[SOUND]]);

  const patternSet = useCallback((idx) => {
    dispatch({
      type: PATTERN_CHAIN,
      value: {
        append: chainTimer.current,
        idx,
      },
    });
    clearChainTimeout(chainTimer);
    chainTimer.current = chainTimeout(dispatch);
  }, []);
  window.state = state;

  return (
    <playerContext.Provider
      value={{
        state,
        dispatch,
        synthAction,
        sounds,
        patternSet,
      }}
    >
      {props.children}
    </playerContext.Provider>
  )
}

export default playerContext;