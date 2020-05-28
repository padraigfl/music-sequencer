import React, {
  createContext,
  useCallback,
  useReducer,
  useRef,
  useEffect,
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

const soundProcessor = new SoundProcessor(getInitialState());

const reducer = (state, action) => {
  if (state.mutable.chainTimer.current && (
    [ SOUNDS_VIEW, CLEAR_VIEW, PATTERN_VIEW ].includes(action.type)
    || state[WRITE]
  )) {
    clearChainTimeout(state.mutable.chainTimer);
  }

  switch (action.type) {
    case PLAY:
      if (Tone.Transport.state !== 'started') {
        Tone.Transport.start();
      }
      soundProcessor.reducer(PLAY, !state[PLAY]);
      return {
        ...state,
        [PLAY]: !state[PLAY],
      };
    case WRITE:
      return {
        ...state,
        [WRITE]: !state[WRITE],
        view: state.view === WRITE ? !state[WRITE] : state.view,
      };
    case PATTERN_VIEW:
      return {
        ...state,
        view: state.view !== PATTERN_VIEW ? PATTERN_VIEW : null,
      };
    case PATTERN_CHAIN:
      if (state[WRITE]) {
        return {
          ...state,
          [PATTERN_IDX]: action.value.idx,
          view: WRITE,
        };
      }
      soundProcessor.reducer(PATTERN_CHAIN, action.value.append ? [...state[PATTERN_CHAIN], action.value.idx ] : [action.value.idx]);
      return {
        ...state,
        [PATTERN_CHAIN]: action.value.append ? [...state[PATTERN_CHAIN], action.value.idx ] : [action.value.idx],
      };
    case SOUNDS_VIEW:
      return {
        ...state,
        view: state.view !== SOUNDS_VIEW ? SOUNDS_VIEW : null,
      };
    case BPM:
      const newBpm = action.value ? action.value : rotateBpm(state[BPM]);
      soundProcessor.reducer(newBpm);
      return {
        ...state,
        [BPM]: action.value ? action.value : rotateBpm(state[BPM]),
      };
    case SOUNDS_SET:
      const idx = (action.value || 0 % 16);
      soundProcessor.reducer(SOUNDS_SET, idx);
      return {
        ...state,
        view: state[WRITE] ? WRITE : null,
        [SOUND]: idx,
        patternType: +action.value === 15 ? 'drums' : 'spots',
      };
    case PATTERN_UPDATE:
      const patternIdx = action.value.idx || state[PATTERN_IDX];
      const lastKey = state[PATTERN_IDX] === 15 ? 'lastBeat' : 'lastNote';
      const updatedPatterns = [
        ...state[PATTERNS].slice(0, patternIdx),
        updatePattern(
          state[PATTERNS][patternIdx],
          action.value.update,
          state.lastNote,
          state.patternType,
        ),
        ...state[PATTERNS].slice(patternIdx + 1),
      ];
      soundProcessor.reducer(PATTERN_UPDATE, updatedPatterns);
      return {
        ...state,
        [PATTERNS]: updatedPatterns,
        [lastKey]: action.value.update.note || state[lastKey],
      }
    case PATTERN_SET:
      if (state[WRITE]) {
        return {
          ...state,
          [PATTERN_IDX]: action.value,
        };
      }
    case CLEAR_VIEW:
      return {
        ...state,
        view: null,
      };
    case VOLUME:
      return updateSingleField(state, action.type, action.value);
    default:
      return state;
  }
}

const chainTimeout = dispatch => setTimeout(() => {
  dispatch({ type: PATTERN_VIEW }); 
}, 3000);

export const ToneProvider = (props) => {
  const chainTimer = useRef(null);
  const [state, dispatch] = useReducer(reducer, getInitialState({ mutable: { chainTimer } }));

  const synthAction = useCallback((note, action = 'release') => {
    console.log(state.selectedSound, note, action);
    switch(action) {
      case 'attack':
        soundProcessor.sound.tone.triggerAttackRelease(note);
        return;
      default: 
        soundProcessor.sound.tone.triggerRelease();
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