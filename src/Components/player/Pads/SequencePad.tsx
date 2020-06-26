import * as React from 'react';
import SequencerCell from '../Cells/Sequencer';
import playContext from '../../../Core/context';
import Pad from './abstractPad';
import { WRITE, PATTERN_UPDATE, PATTERNS, PATTERN_IDX, CANCEL, NOTE_COPY, PATTERN_TYPE, SOUND } from '../../../Core/_constants';
import NotesPad from './NotesPad';
import NumberPad from './NumberPad';
import { generateKeys } from '../../../System/_utils';

const getNoteDisplay = (note, customKeys) => {
  let disp = customKeys
    ? customKeys[note.note]
    : note.note;
  return `${disp}${note.span ? `-${note.span}` : ''}`
};

type NewSequence = { idx?: number; note?: string; span?: number };

// Primary composition pad
// Writes 16 step sequences to loop
const SequencePad = () => {
  const holdTimer = React.useRef(null);
  const { state, dispatch, sounds, startNote } = React.useContext(playContext);
  const [ newSequenceValue, updateNewValue ]: [NewSequence, React.Dispatch<React.SetStateAction<NewSequence>>] = React.useState({});
  const [copyValue, setCopyValue] = React.useState(null);
  const pattern = React.useMemo(() => {
    return state[PATTERNS][state[PATTERN_IDX]];
   }, [state[PATTERNS], state[PATTERN_IDX]]);
  const patternType = React.useMemo(() => state[PATTERN_TYPE], [state[PATTERN_TYPE]]);
  const customKeys = React.useMemo(() => {
    if (!sounds[state[SOUND]].keys) {
      return null;
    }
    return generateKeys(+startNote[1]).reduce((acc, val, idx) => ({
      ...acc,
      [val.id]: sounds[state[SOUND]].keys[idx]
    }), {})
  }, [state[SOUND]]);

  React.useEffect(() => {
    if (state.lastAction === CANCEL) {
      updateNewValue({});
      setCopyValue(null);
    }
  }, [state])


  // clear on cancel ??
  const initalPattern = React.useMemo(() => (
    JSON.parse(JSON.stringify(state[PATTERNS][state[PATTERN_IDX]]))
  ), [state[PATTERN_IDX]]);

  const updateCopyValue = React.useCallback((value) => {
    setCopyValue(value);
  }, []);

  const updatePattern = React.useCallback(({ idx, note, span }) => {
    dispatch({
      type: PATTERN_UPDATE,
      value: {
        idx, note, span,
      },
    });
    updateNewValue({});
  }, [state[PATTERNS], state[PATTERN_IDX]]);

  const onSelectStep = React.useCallback((e) => {
    const idx = +e.currentTarget.dataset.value;
    const currentPattern = state[PATTERNS][state[PATTERN_IDX]];
    if (copyValue) {
      updatePattern({ idx, ...copyValue });
    } else if (currentPattern[patternType][idx]) {
      updatePattern({ idx });
    } else {
      updateNewValue({ idx });
    }
  }, [copyValue, state[PATTERNS]]);

  const onSimpleSetNote = React.useCallback((e) => {
    console.log(e);
    const isBasicDrum = state[PATTERN_TYPE] === 'drums';
    if (holdTimer.current || isBasicDrum) {
      const value = e.currentTarget.dataset.value;
      updatePattern({
        ...newSequenceValue,
        note: value,
        span: !isBasicDrum ? 1 : undefined,
      });
      return;
    }
    clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }, [newSequenceValue]);

  const onSelectNote = React.useCallback((e) => {
    const value = e.currentTarget.dataset.value;
    console.log('a');
    holdTimer.current = setTimeout(() => {
      console.log('b');
      if (state[PATTERN_TYPE] === 'drums') {
        updatePattern({ ...newSequenceValue, note: value});
      } else {
        updateNewValue({ ...newSequenceValue, note: value });
      }
      holdTimer.current = null;
    }, 300);
  }, [newSequenceValue]);

  const clearIt = React.useCallback(() => clearTimeout(holdTimer.current), []);

  const onSelectLength = React.useCallback((e) => {
    const value = +e.currentTarget.dataset.value;
    updatePattern({ ...newSequenceValue, span: value });
  }, [newSequenceValue]);

  return (
    React.useMemo(() => state[WRITE] && (
      <>
        {typeof newSequenceValue.idx !== 'number'
          && pattern
          && pattern[patternType]
          && (
            <Pad>
              { pattern[patternType].map((note, idx) =>
                <SequencerCell
                  {...note}
                  onClick={onSelectStep}
                  key={idx}
                  highlight={idx === state[PATTERN_IDX]}
                  display={note ? getNoteDisplay(note, customKeys)  : null}
                  action={PATTERN_UPDATE}
                  secondaryAction={NOTE_COPY}
                />
              )}
            </Pad>
          )
        }
        {typeof newSequenceValue.idx === 'number' && !newSequenceValue.note && (
          <NotesPad
            activeChildIdx={newSequenceValue.idx}
            onClick={onSimpleSetNote}
            onHold={onSelectNote}
            onRelease={clearIt}
            action={'pattern_entry_note'} 
            italic
            bold />
        )}
        {typeof newSequenceValue.idx === 'number' && newSequenceValue.note && (
          <NumberPad
            activeChildIdx={newSequenceValue.idx}
            onClick={onSelectLength}
            action={'pattern_entry_length'}
            italic
            bold
            displayValue
          />
        )}
      </>
    ), [newSequenceValue, state[PATTERNS], state[WRITE]])
  );
};

export default SequencePad;
