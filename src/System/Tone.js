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
} from './_utils';

const playerContext = createContext({});

const sounds = [
  new Tone.Synth().toMaster(),
  new Tone.DuoSynth(),
  new Tone.FMSynth(),
  new Tone.Instrument(),
  new Tone.MembraneSynth(),
  new Tone.MetalSynth(),
  new Tone.Monophonic(),
  new Tone.MonoSynth(),
  new Tone.NoiseSynth(),
  new Tone.PluckSynth(),
  new Tone.PolySynth(),
  new Tone.Sampler(),
  new Tone.DuoSynth(),
  new Tone.FMSynth(),
  new Tone.Instrument(),
];

const toggleActions = [PLAY, WRITE, PATTERN];

const reducer = (state, action) => {
  if (toggleActions.includes(action.type)) {
    return {
      ...state,
      [action.type]: !state[action.type],
    }
  }
  console.log(action.type, state[BPM], action.value);
  switch (action.type) {
    case BPM:
      console.log(action)
      return {
        ...state,
        [BPM]: action.value ? action.value : rotateBpm(state[BPM]),
      };
    case SOUND: 
      return {
        ...state,
        [SOUND]:  sounds[idx % 16].toMaster(),
      };
    case VOLUME:
      return updateSingleField(state, action.type, action.value);
    default:
      return state;
  }
}

export const ToneProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(sounds));

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
    console.log(note, action);
    switch(action) {
      case 'attack':
        state.sound.triggerAttackRelease(note);
        return;
      default: 
        state.sound.triggerRelease();
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
      }}
    >
      {props.children}
    </playerContext.Provider>
  )
}

export default playerContext;