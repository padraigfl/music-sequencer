import React, {
  createContext,
  useCallback,
  useReducer,
  useRef,
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

const playerContext = createContext({});

const sounds = [
  [ new Tone.Synth().toMaster(), 'synth' ],
  [ new Tone.DuoSynth(), 'duo' ],
  [ new Tone.FMSynth(), 'fm' ],
  [ new Tone.Instrument(), 'instr' ],
  [ new Tone.MembraneSynth(), 'membr' ],
  [ new Tone.MetalSynth(), 'metal' ],
  [ new Tone.Monophonic(), 'monoph' ],
  [ new Tone.MonoSynth(), 'mono' ],
  [ new Tone.NoiseSynth(), 'noise' ],
  [ new Tone.PluckSynth(), 'pluck' ],
  [ new Tone.PolySynth(), 'poly' ],
  [ new Tone.Sampler(), 'sampl' ],
  [ new Tone.DuoSynth(), 'duo' ],
  [ new Tone.FMSynth(), 'fm' ],
  [ new Tone.Instrument(), 'inst' ],
  [ new Tone.Instrument(), 'basicdrum', new Array(16).fill(null).map((v, idx) => String.fromCharCode(idx + 3330)) ],
].map((v, idx) => ({
  tone: v[0],
  name: v[1],
  id: idx,
  keys: v[2],
}));


// @todo more complex overwrites passed in by context?
const updatePattern = (pattern, updateData, lastNote, key = 'spots') => {
  const { note = lastNote, span, idx } = updateData;
  debugger;
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

const toggleActions = [PLAY];

const clearChainTimeout = ref => {
  if (ref.current) {
    clearTimeout(ref.current);
  }
  ref.current = null;
}

const reducer = (state, action) => {
  if (toggleActions.includes(action.type)) {
    return {
      ...state,
      [action.type]: !state[action.type],
    }
  }

  if (state.mutable.chainTimer.current && (
    [ SOUNDS_VIEW, CLEAR_VIEW, PATTERN_VIEW ].includes(action.type)
    || state[WRITE]
  )) {
    clearChainTimeout(state.mutable.chainTimer);
  }

  switch (action.type) {
    case PLAY: 
      return {
        ...state,
        [PLAY]: !state[PLAY],
      };
    case WRITE:
      return {
        ...state,
        [WRITE]: !state[WRITE],
        view: !state[WRITE] ? WRITE : null,
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
      return {
        ...state,
        [BPM]: action.value ? action.value : rotateBpm(state[BPM]),
      };
    case SOUNDS_SET:
      const idx = (action.value || 0 % 16);
      sounds[idx].tone.toMaster();
      return {
        ...state,
        view: null,
        [SOUND]: idx,
      };
    case PATTERN_UPDATE:
      const patternIdx = action.value.idx || state[PATTERN_IDX];
      const lastKey = state[PATTERN_IDX] === 15 ? 'lastBeat' : 'lastNote';
      return {
        ...state,
        [PATTERNS]: [
          ...state[PATTERNS].slice(0, patternIdx),
          updatePattern(
            state[PATTERNS][patternIdx],
            action.value.update,
            state.lastNote,
            state[SOUND] === 15 ? 'drums' : undefined,
          ),
          ...state[PATTERNS].slice(patternIdx + 1),
        ],
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
        sounds[state[SOUND]].tone.triggerAttackRelease(note);
        return;
      default: 
        sounds[state[SOUND]].tone.triggerRelease();
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