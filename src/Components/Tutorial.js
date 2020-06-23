import React, { useContext, useMemo } from 'react';
import Joyride from 'react-joyride';
import playerContext from '../Core/context';
import { MUTE, WRITE, SOUND, SOUNDS_SET, SOUNDS_VIEW, PATTERN_SET, PATTERN_UPDATE, MULTI_TOUCH, PATTERN_COPY, NOTE_COPY } from '../Core/_constants';

const getSteps = (dispatch, sounds) => [{
    target: '#action--menu',
    content: 'If on iOS, please disable silent. Then click the mute button to enable audio',
    callback: () => dispatch({ type: MUTE }),
  }, {
    target: '#live-status--0',
    content: 'Click a note to test audio',
    callback: () => {
      sounds[0].tone.triggerAttack('c3');
    },
  },  {
    target: '#live-status--0',
    content: 'A sample sound should be playing, click next to stop',
    callback: () => {
      sounds[0].tone.triggerRelease();
    },
  }, {
    target: `#action--${SOUNDS_VIEW}`,
    content: 'Switches to instrument selection view',
    callback: () => {
      dispatch({ type: SOUNDS_VIEW });
    },
  }, {
    target: `.Pad`,
    content: 'Select another sound from the 4x4 pad',
    callback: () => {
      dispatch({ type: SOUNDS_SET, value: 1 });
      sounds[1].tone.toMaster();
    },
  }, {
    target: `#action--${SOUNDS_VIEW}`,
    content: 'Lets try another sound, it should be different now',
    callback: () => {
      sounds[1].tone.triggerAttack('c3');
    },
  }, {
    target: `#action--${SOUNDS_VIEW}`,
    content: 'A different sound should be playing now, click next to stop',
    callback: () => {
      sounds[1].tone.triggerRelease();
    },
  }, {
    target: `#action--${WRITE}`,
    content: 'Switches to composition mode',
    callback: () => dispatch({ type: WRITE }),
  }, {
    target: `.Pad`,
    content: 'On this display, when the UI reads "compose" you sequence 16 step patterns',
  }, {
    target: `[data-idx="0"]`,
    content: 'Click an entry to select a note, hold a note to select the duration of the note (defaults to a quarter)',
    callback: () => dispatch({ type: PATTERN_UPDATE, value: { idx: 0, note: 'C3', span: 4 }}),
  }, {
    target: `[data-idx="0"]`,
    content: 'Click an entry to select a note, hold a note to select the duration of the note (defaults to a quarter)',
    callback: () => dispatch({ type: PATTERN_UPDATE, value: { idx: 0, note: 'C3', span: 4 }}),
  }, {
    target: `[data-idx="6"]`,
    content: 'Copy a note by holding it and pressing another square (or click it again to wipe)',
    callback: () => {
      dispatch({ type: MULTI_TOUCH, value: [ { secondary: NOTE_COPY, value: 0 }, { value: 6 }]});
    }
  },
];

// patterns explained

// pad explained

// basics

// 

const fireCallbackOnStepEnd = (state) => {
  if (state.lifecycle === 'complete' && state.step.callback) {
    state.step.callback();
  }
};

const Tutorial = () => {
  const { dispatch, sounds } = useContext(playerContext);
  const steps = useMemo(() => getSteps(dispatch, sounds), [dispatch, sounds]);
  return useMemo(() => <Joyride steps={steps} callback={fireCallbackOnStepEnd} continuous />, [steps]);
};

export default Tutorial;
