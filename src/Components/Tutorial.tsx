import * as React from 'react';
import Joyride from 'react-joyride';
import playerContext from '../Core/context';
import { MUTE, WRITE, SOUNDS_VIEW, PATTERN_UPDATE, MULTI_TOUCH, PATTERN_COPY, NOTE_COPY, PATTERN_VIEW, PLAY, BPM, SOUNDS_SET, PATTERN_CHAIN } from '../Core/_constants';
import styled from 'styled-components';

const Shell = styled('div')`
  position: fixed;
  top: 0px; 
  width: 100%;
  height: 100%;
`;

let timeout: any = 0;

const getSteps = (dispatch, sounds, setOverlay) => [{
    disableBeacon: true,
    target: `#action--${MUTE}`,
    content: (
      <>
        <p>Due to browser restrictions, the audio button is in the active state by default (meaning muted), please unmute.</p>
        <p>If you are on iOS you may need to turn off silent on your phone too.</p>
      </>
    ),
    callback: () => dispatch({ type: MUTE }),
  }, {
    target: '#live-status--0',
    content: (<><p>Click a note to test audio</p></>),
    callback: () => {
      sounds[0].tone.triggerAttack('c3');
    },
  },  {
    target: '#live-status--0',
    content: (<><p>A sample sound should be playing, click next to stop</p></>),
    callback: () => {
      sounds[0].tone.triggerRelease();
    },
  }, {
    target: `.Pad`,
    content: (<><p>This 16 grid pad covers a range of functions depending on the current view and settings.</p><p> From left to right, top to bottom each button represents an incrementing value for the relevant field (in this case notes to play)</p></>),
    callback: () => {
      dispatch({ type: SOUNDS_VIEW });
    },
  }, {
    target: `#action--${SOUNDS_VIEW}`,
    content: (<><p>Switches to instrument selection view, here you select the current sound you are playing with live and editing sequences for.</p><p> Select an instrument to exit.</p></>),
  }, {
    target: '.Pad',
    content: (<><p>Here you select the instrument you want to work with, w/e of the last instrument (for basic drum beats), you can only have one active instrument at a time in the current system.</p><p> When you change instrument the sound in the sequence will update to use the new instrument</p></>),
    callback: () => {
      dispatch({ type: PATTERN_VIEW });
    }, 
  }, {
    target: `#action--${PATTERN_VIEW}`,
    content: (<><p>Switches to pattern view</p></>),
  }, {
    target: '.Pad',
    content: (<><p>from here you select the current pattern to edit and the chain of patterns to play.</p><p> The existing pattern chain will flash sequentially in order in this view.</p></>),
    callback: () => {
      dispatch({ type: PATTERN_VIEW });
      dispatch({ type: WRITE });
    }, 
  }, {
    target: `#action--${WRITE}`,
    content: (<><p>When this is on, the default view allows editing of the currently active pattern sequence</p></>),
    callback: () => {
      dispatch({ type: WRITE });
      dispatch({ type: PLAY });
    }, 
  }, {
    target: `#action--${PLAY}`,
    content: (<><p>Toggles whether the active sequence is playing or not, updates you do to patterns should apply live.</p><p>The green light represents the current pattern and the red one represents the index within that pattern.</p></>),
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
    content: (<><p>This changes the speed of the pattern, press to go between speeds</p></>),
    callback: () => {
      clearInterval(timeout);
      timeout = null;
    },
  }, {
    target: `#action--${WRITE}`,
    content: (<><p>Switches to composition mode</p></>),
    callback: () => dispatch({ type: WRITE }),
  }, {
    target: `.Pad`,
    content: (<><p>On this display, when the UI reads "compose" you sequence 16 step patterns</p></>),
  }, {
    target: `[data-idx="0"]`,
    content: (<><p>Click an entry to select a note, hold a note to select the duration of the note (defaults to a quarter)</p></>),
    callback: () => dispatch({ type: PATTERN_UPDATE, value: { idx: 0, note: 'C3', span: 4 }}),
  }, {
    target: `[data-idx="0"]`,
    content: (<><p>Click an entry to select a note, hold a note to select the duration of the note (defaults to a quarter)</p></>),
    callback: () => dispatch({ type: PATTERN_UPDATE, value: { idx: 0, note: 'C3', span: 4 }}),
  }, {
    target: `[data-idx="6"]`,
    content: (<><p>Copy a note by holding it and pressing another square (or click it again to wipe)</p></>),
    callback: () => {
      dispatch({ type: MULTI_TOUCH, value: [ { secondary: NOTE_COPY, value: 0 }, { value: 6 }]});
    }
  }, {
    target: `#action--${SOUNDS_VIEW}`,
    content: (<><p>By selecting option 16 from the sounds view, you can add a basic drum beat to your pattern too</p></>),
    callback: () => {
      dispatch({ type: SOUNDS_SET, value: 15 });
    }, 
  }, {
    target: `[data-idx="0"]`,
    content: (<><p>Drum beats add in the same manner</p></>),
    callback: () => {
      dispatch({ type: PATTERN_UPDATE, value: { idx: 0, note: 'C3' }});
      dispatch({ type: PATTERN_UPDATE, value: { idx: 4, note: 'F3' }});
      dispatch({ type: PATTERN_UPDATE, value: { idx: 8, note: 'C3' }});
      dispatch({ type: PATTERN_UPDATE, value: { idx: 12, note: 'C4' }});
    }
  },  {
    target: `#action--${PATTERN_VIEW}`,
    content: (<><p>Returning to pattern view will now show data relating to the changes for pattern 1</p></>),
    callback: () => {
      dispatch({ type: PATTERN_VIEW });
    }, 
  },  {
    target: `.Pad`,
    content: (<><p>To copy a pattern, hold the pattern and then touch another pattern (or cancel to erase)</p></>),
    callback: () => {
      dispatch({ type: MULTI_TOUCH, value: [{ secondary: PATTERN_COPY, idx: 0, value: 0 }, { idx: 1, value: 1 }] });
    }, 
  }, {
    target: `.Pad`,
    content: (<><p>Now you can edit the pattern to create a second variant quickly</p></>),
  }, {
    target: `#action--${SOUNDS_VIEW}`,
    content: (<><p>You can change the sound live (behaviour may be different on different players)</p></>),
    callback: () => {
      dispatch({ type: SOUNDS_VIEW });
      dispatch({ type: SOUNDS_SET, value: 1 });
      dispatch({ type: WRITE });
    }, 
  }, {
    target: `.Pad`,
    content: (<><p>Lets add some extra sounds to pattern 1</p></>),
    callback: () => {
      dispatch({ type: PATTERN_UPDATE, value: { idx: 4, note: 'A2', span: 1 }});
      dispatch({ type: PATTERN_UPDATE, value: { idx: 5, note: 'b2', span: 1 }});
    }, 
  }, {
    target: `.Pad`,
    content: (<><p>You should now be hearing two unique patterns play</p></>),
    callback: () => {
      debugger;
      dispatch({ type: PATTERN_VIEW });
    }, 
  }, {
    target: `#action-${PATTERN_VIEW}`,
    content: (<><p>To alter the sequence of patterns, hold the patterns button and type the buttons in the order you wish to sequence them (in this case we will try 0 1 0 2)</p></>),
    callback: () => {
      dispatch({ type: MULTI_TOUCH, value: [{ secondary: PATTERN_CHAIN }, { value: 0, idx: 0 } ] });
      dispatch({ type: MULTI_TOUCH, value: [{ secondary: PATTERN_CHAIN }, { value: 2, idx: 2 } ] });
    }, 
  }, {
    target: 'body',
    content: (
      <>
        <p>That's all I can be bothered with for now, I will try and break this up into parts and allow the ability to go back and forward through it at a later date hopefully.</p>
        <p>There should be an instruction manual up somewhere to consult soon too. Press next to play with this data, alternatively you can <a href="https://github.com/padraigfl/music-sequencer" target="_blank">view additional documents here</a></p>
      </>
    ),
    callback: (x, y) => {
      setOverlay(false);
    },
  }
];

const fireCallbackOnStepEnd = (state: any): void => {
  if (state.lifecycle === 'complete' && state.step.callback) {
    state.step.callback();
  }
  // TODO reverse action
};

const Tutorial: React.FC<null> = () => {
  const [overlay, setOverlay] = React.useState(true);
  const { dispatch, sounds } = React.useContext(playerContext);
  const steps = React.useMemo(() => getSteps(dispatch, sounds, setOverlay), [dispatch, sounds]);
  return React.useMemo(() => {
    const Wrapper = overlay ? Shell : React.Fragment;
    return (
      <Wrapper>
        <Joyride
          steps={steps}
          callback={fireCallbackOnStepEnd}
          hideBackButton
          disableOverlayClose
          disableCloseOnEsc
          continuous
          run
        />
      </Wrapper>
    );
  }, [steps, overlay]);
};

export default Tutorial;
