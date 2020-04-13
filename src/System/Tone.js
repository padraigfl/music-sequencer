import React, {
  createContext,
  useState,
  useCallback,
  useReducer,
} from 'react';

import Tone from 'tone';
import {
  getInitialState,
  PLAY,
  WRITE,
  PATTERN,
  BPM,
  VOLUME,
  SOUND,
  rotateBpm,
  updateSingleField,
  SOUNDS_SET,
  SOUNDS_VIEW,
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

console.log(sounds);

const toggleActions = [PLAY, WRITE, PATTERN, SOUNDS_VIEW];

const reducer = (state, action) => {
  if (toggleActions.includes(action.type)) {
    return {
      ...state,
      [action.type]: !state[action.type],
    }
  }

  switch (action.type) {
    case BPM:
      console.log(action)
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
    case VOLUME:
      return updateSingleField(state, action.type, action.value);
    default:
      return state;
  }
}

export const ToneProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  // @todo, pattern scope may be bigger
  const [patterns, updatePatterns] = useState(new Array(16).fill(null));

  const updatePattern = useCallback((idx, pattern) => {
    updatePatterns([
      ...patterns.slice(0, idx),
      pattern,
      ...patterns.slice(idx + 1),
    ]);
  }, [patterns]);

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

  console.log(state);

  return (
    <playerContext.Provider
      value={{
        state,
        dispatch,
        synthAction,
        patterns, updatePattern,
        sounds,
      }}
    >
      {props.children}
    </playerContext.Provider>
  )
}

export default playerContext;