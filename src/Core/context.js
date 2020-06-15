import React, {
  createContext,
  useCallback,
  useReducer,
  useState,
  useEffect,
  useMemo,
} from 'react';

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

const playerContext = createContext({});

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
            value2,
          ),
        }
        : {};
    case NOTE_COPY:
      let note1 = getValueFromDataset(values[0]);
      let note2 = getValueFromDataset(values[1]);
      return isInRange(note1) && isInRange(note2)
        ? {
          [PATTERNS]: updateNoteInPattern(
            state,
            state[PATTERNS][state[PATTERN_IDX]][state[PATTERN_TYPE] || state[SOUND]][note1],
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

const defaultActionHandlers = {
  [PLAY]: state =>({ [PLAY]: !state[PLAY] }),
  [WRITE]: state => ({
    [WRITE]: !state[WRITE],
    view: (state[WRITE] ? state.view : null),
  }),
  [CLEAR_VIEW]: () => ({ view: null }),
  [SOUNDS_VIEW]: state => ({
    view: (state.view !== SOUNDS_VIEW ? SOUNDS_VIEW : null),
  }),
  [SOUNDS_SET]: (state, value) => ({
    view: state[WRITE] ? WRITE : null,
    [SOUND]: value,
    [PATTERN_TYPE]: value,
  }),
  [PATTERN_VIEW]: state => ({
    view: (state.view !== PATTERN_VIEW ? PATTERN_VIEW : null),
    [WRITE]: false,
  }),
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
    const activePattern = state[PATTERNS][state[PATTERN_IDX]];
    const updatedPatterns = [
      ...state[PATTERNS].slice(0, state[PATTERN_IDX]),
      {
        ...activePattern,
        [state[SOUND]]: [
          ...activePattern[state[SOUND]].slice(0, idx),
          note ? { note, span } : null,
          ...activePattern[state[SOUND]].slice(idx + 1),
        ],
      },
      ...state[PATTERNS].slice(state[PATTERN_IDX] + 1),
    ];
    return {
      [PATTERNS]: updatedPatterns,
      lastNote: note || state.lastNote,
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
    view: null,
  }),
}

const generateReducer = (actionHandler = defaultActionHandler) => (state, action) => {
  let stateChanges = actionHandler[action.type] ? actionHandler[action.type](state, action.value) : {};

  let newState = {
    ...state,
    ...stateChanges,
    lastAction: action.type !== MULTI_TOUCH
      ? action.type
      : stateChanges.lastAction || action.value[0].secondary,
  };
  return newState;
}

export const ToneProvider = (props) => {
  const initialState = useMemo(() => getInitialState({
    customState: props.AudioProcessor.customState,
  }), []);
  const coreReducer = useMemo(() => (
    generateReducer({
      ...defaultActionHandlers,
      ...props.AudioProcessor.customReducer,
    })
  ), []);
  const soundProcessor = useMemo(() => new props.AudioProcessor(initialState), []);

  const [state, dispatch] = useReducer(
    coreReducer,
    initialState,
  );

  useEffect(() => {
    soundProcessor.reducer(state.lastAction, state);
    if (state.lastAction === 'menu'&& !props.history.location.pathname.match(/.*\/menu$/)) {
      props.history.push(`${props.history.location.pathname}/menu`);
    }
  }, [state]);

  const synthAction = useCallback((note, action = 'release', length) => {
    switch(action) {
      case 'attack':
        soundProcessor.sound.tone.triggerAttackRelease(note, length);
        return;
      default:
        soundProcessor.sound.tone.triggerRelease();
        return;
    }
  }, [state[SOUND]]);

  return (
    <playerContext.Provider
      value={{
        state,
        dispatch,
        synthAction,
        sounds: props.AudioProcessor.sounds,
        view: state.view,
        startNote: props.AudioProcessor.startNote,
      }}
    >
      {props.children}
    </playerContext.Provider>
  );
}

export default playerContext;