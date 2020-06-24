import React, { useContext, useMemo } from 'react';
import Joyride from 'react-joyride';
import playerContext from '../Core/context';
import { MUTE, WRITE, SOUNDS_VIEW, PATTERN_UPDATE, MULTI_TOUCH, PATTERN_COPY, NOTE_COPY, PATTERN_VIEW, PLAY, BPM, SOUNDS_SET, PATTERN_CHAIN } from '../Core/_constants';
import styled from 'styled-components';

const Shell = styled('div')`
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0px; 
  width: 100%;
  height: 100%;
`;

let timeout = 0;

const getSteps = (dispatch, sounds) => [{
    disableBeacon: true,
    target: `#action--${MUTE}`,
    content: 'Due to browser restrictions, the audio button is in the active state by default (meaning muted), please unmute. If you are on iOS you may need to turn off silent on your phone too.',
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
    target: `.Pad`,
    content: 'This 16 grid pad covers a range of functions depending on the current view and settings. From left to right, top to bottom each button represents an incrementing value for the relevant field (in this case notes to play)',
    callback: () => {
      dispatch({ type: SOUNDS_VIEW });
    },
  }, {
    target: `#action--${SOUNDS_VIEW}`,
    content: 'Switches to instrument selection view, here you select the current sound you are playing with live and editing sequences for. Select an instrument to exit. ',
  }, {
    target: '.Pad',
    content: 'Here you select the instrument you want to work with, w/e of the last instrument (for basic drum beats), you can only have one active instrument at a time in the current system. When you change instrument the sound in the sequence will update to use the new instrument',
    callback: () => {
      dispatch({ type: PATTERN_VIEW });
    }, 
  }, {
    target: `#action--${PATTERN_VIEW}`,
    content: 'Switches to pattern view',
  }, {
    target: '.Pad',
    content: 'from here you select the current pattern to edit and the chain of patterns to play. The existing pattern chain will flash sequentially in order in this view.',
    callback: () => {
      dispatch({ type: PATTERN_VIEW });
      dispatch({ type: WRITE });
    }, 
  }, {
    target: `#action--${WRITE}`,
    content: 'When this is on, the default view allows editing of the currently active pattern sequence',
    callback: () => {
      dispatch({ type: WRITE });
      dispatch({ type: PLAY });
    }, 
  }, {
    target: `#action--${PLAY}`,
    content: 'Toggles whether the active sequence is playing or not, updates you do to patterns should apply live. The green light represents the current pattern and the red one represents the index within that pattern.',
    callback: () => {
      let i = 0;
      timeout = setInterval(() => {
        dispatch({ type: BPM });
        i++;
        if (i > 10) {
          clearInterval(timeout);
          timeout = null;
        }
      }, 4000);
    }, 
  }, {
    target: `#action--${BPM}`,
    content: 'This changes the speed of the pattern, press to go between speeds',
    callback: () => {
      clearInterval(timeout);
      timeout = null;
    },
  // }, {
  //   target: `.Pad`,
  //   content: 'This 16 grid pad covers a range of functions depending on the current view and settings.',
  //   callback: () => {
  //     dispatch({ type: SOUNDS_SET, value: 1 });
  //     sounds[1].tone.toMaster();
  //   },
  // }, {
  //   target: `#action--${SOUNDS_VIEW}`,
  //   content: 'Lets try another sound, it should be different now',
  //   callback: () => {
  //     sounds[1].tone.triggerAttack('c3');
  //   },
  // }, {
  //   target: `#action--${SOUNDS_VIEW}`,
  //   content: 'A different sound should be playing now, click next to stop',
  //   callback: () => {
  //     sounds[1].tone.triggerRelease();
  //   },
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
  }, {
    target: `#action--${SOUNDS_VIEW}`,
    content: 'By selecting option 16 from the sounds view, you can add a basic drum beat to your pattern too',
    callback: () => {
      dispatch({ type: SOUNDS_SET, value: 15 });
    }, 
  }, {
    target: `[data-idx="0"]`,
    content: 'Drum beats add in the same manner',
    callback: () => {
      dispatch({ type: PATTERN_UPDATE, value: { idx: 0, note: 'C3' }});
      dispatch({ type: PATTERN_UPDATE, value: { idx: 4, note: 'F3' }});
      dispatch({ type: PATTERN_UPDATE, value: { idx: 8, note: 'C3' }});
      dispatch({ type: PATTERN_UPDATE, value: { idx: 12, note: 'C4' }});
    }
  },  {
    target: `#action--${PATTERN_VIEW}`,
    content: 'Returning to pattern view will now show data relating to the changes for pattern 1',
    callback: () => {
      dispatch({ type: PATTERN_VIEW });
    }, 
  },  {
    target: `.Pad`,
    content: 'To copy a pattern, hold the pattern and then touch another pattern (or cancel to erase)',
    callback: () => {
      dispatch({ type: MULTI_TOUCH, value: [{ secondary: PATTERN_COPY, idx: 0, value: 0 }, { idx: 1, value: 1 }] });
    }, 
  }, {
    target: `.Pad`,
    content: 'Now you can edit the pattern to create a second variant quickly',
  }, {
    target: `#action--${SOUNDS_VIEW}`,
    content: 'You can change the sound live (behaviour may be different on different players)',
    callback: () => {
      dispatch({ type: SOUNDS_VIEW });
      dispatch({ type: SOUNDS_SET, value: 1 });
      dispatch({ type: WRITE });
    }, 
  }, {
    target: `.Pad`,
    content: 'Lets add some extra sounds to pattern 1',
    callback: () => {
      dispatch({ type: PATTERN_UPDATE, value: { idx: 4, note: 'A2', span: 1 }});
      dispatch({ type: PATTERN_UPDATE, value: { idx: 5, note: 'b2', span: 1 }});
    }, 
  }, {
    target: `.Pad`,
    content: 'You should now be hearing two unique patterns play',
    callback: () => {
      debugger;
      dispatch({ type: PATTERN_VIEW });
    }, 
  }, {
    target: `#action-${PATTERN_VIEW}`,
    content: 'To alter the sequence of patterns, hold the patterns button and type the buttons in the order you wish to sequence them (in this case we will try 0 1 0 2)',
    callback: () => {
      dispatch({ type: MULTI_TOUCH, value: [{ secondary: PATTERN_CHAIN }, { value: 0, idx: 0 } ] });
      dispatch({ type: MULTI_TOUCH, value: [{ secondary: PATTERN_CHAIN }, { value: 2, idx: 2 } ] });
    }, 
  }, {
    target: 'body',
    content: 'That\'s all I can be bothered with for now, I will try and break this up into parts and allow the ability to go back and forward through it at a later date hopefully. There should be an instruction manual up somewhere to consult soon too. Press X to exit this and play with the edited data from this demo or hit the callback button to redirect to a new page/',
    callback: (x, y) => {
      console.log(x, y);
      window.location.href = '/solo/melody/normal';
    },
  }
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
  return useMemo(() => (
      <Joyride
        steps={steps}
        callback={fireCallbackOnStepEnd}
        hideBackButton
        disableOverlayClose
        disableCloseOnEsc
        continuous
        run
      />
  ), [steps]);
};

export default Tutorial;
