import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
  useContext,
} from 'react';
import SequencerCell from '../Cells/Sequencer';
import playContext from '../../../Core/context';
import Pad from './abstractPad';
import { WRITE, PATTERN_UPDATE, PATTERNS, PATTERN_IDX, CANCEL, NOTE_COPY, PATTERN_TYPE, SOUND } from '../../../Core/_constants';
import NotesPad from './NotesPad';
import NumberPad from './_numberPad';
import { generateKeys } from '../../../System/_utils';

const getNoteDisplay = (note, customKeys) => {
  let disp = customKeys
    ? customKeys[note.note]
    : note.note;
  return `${disp}${note.span ? `-${note.span}` : ''}`
};

// Primary composition pad
// Writes 16 step sequences to loop
const SequencePad = () => {
  const holdTimer = useRef(null);
  const { state, dispatch, sounds, startNote } = useContext(playContext);
  const [ newSequenceValue, updateNewValue ] = useState({});
  const [copyValue, setCopyValue] = useState(null);
  const pattern = useMemo(() => {
    return state[PATTERNS][state[PATTERN_IDX]];
   }, [state[PATTERNS], state[PATTERN_IDX]]);
  const patternType = useMemo(() => state[PATTERN_TYPE], [state[PATTERN_TYPE]]);
  const customKeys = useMemo(() => {
    if (!sounds[state[SOUND]].keys) {
      return null;
    }
    return generateKeys(+startNote[1]).reduce((acc, val, idx) => ({
      ...acc,
      [val.id]: sounds[state[SOUND]].keys[idx]
    }), {})
  }, [state[SOUND]]);

  useEffect(() => {
    if (state.lastAction === CANCEL) {
      updateNewValue({});
      setCopyValue(null);
    }
  }, [state])


  // clear on cancel ??
  const initalPattern = useMemo(() => (
    JSON.parse(JSON.stringify(state[PATTERNS][state[PATTERN_IDX]]))
  ), [state[PATTERN_IDX]]);

  const updateCopyValue = useCallback((value) => {
    setCopyValue(value);
  }, []);

  const updatePattern = useCallback(({ idx, note, span }) => {
    dispatch({
      type: PATTERN_UPDATE,
      value: {
        idx, note, span,
      },
    });
    updateNewValue({});
  }, [state[PATTERNS], state[PATTERN_IDX]]);

  const onSelectStep = useCallback((e) => {
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

  const onSimpleSetNote = useCallback((e) => {
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

  const onSelectNote = useCallback((e) => {
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

  const clearIt = useCallback(() => clearTimeout(holdTimer.current), []);

  const onSelectLength = useCallback((e) => {
    const value = +e.currentTarget.dataset.value;
    updatePattern({ ...newSequenceValue, span: value });
  }, [newSequenceValue]);

  return (
    useMemo(() => state[WRITE] && (
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
                  idx={idx}
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
