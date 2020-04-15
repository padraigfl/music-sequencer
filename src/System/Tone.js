import React, {
  createContext,
  useCallback,
  useReducer,
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
  PATTERN_IDX,
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
].map((v, idx) => ({
  tone: v[0],
  name: v[1],
  id: idx,
}));


// @todo more complex overwrites passed in by context?
const updatePattern = (pattern, updateData, lastNote) => {
  const { note = lastNote, span, idx } = updateData;
  const currentVal = pattern.spots[idx];
  return {
    ...pattern,
    spots: [
      ...pattern.spots.slice(0, idx),
      currentVal && currentVal.note && !updateData.note ? null : { note, span },
      ...pattern.spots.slice(idx + 1),
    ],
  }
};

const toggleActions = [PLAY, WRITE, SOUNDS_VIEW, PATTERN_VIEW];

const reducer = (state, action) => {
  if (toggleActions.includes(action.type)) {
    return {
      ...state,
      [action.type]: !state[action.type],
    }
  }

  switch (action.type) {
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
        [SOUNDS_VIEW]: false,
        [SOUND]: idx,
      };
    case PATTERN_UPDATE:
      const patternIdx = action.value.idx || state[PATTERN_IDX];
      return {
        ...state,
        [PATTERNS]: [
          ...state[PATTERNS].slice(0, patternIdx),
          updatePattern(state[PATTERNS][patternIdx], action.value.update, state.lastNote),
          ...state[PATTERNS].slice(patternIdx + 1),
        ],
        lastNote: action.value.update.note || state.lastNote,
      }
    case VOLUME:
      return updateSingleField(state, action.type, action.value);
    default:
      return state;
  }
}

export const ToneProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

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