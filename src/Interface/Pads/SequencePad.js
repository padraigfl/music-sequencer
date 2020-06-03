import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useContext,
} from 'react';
import PatternCell from '../Cells/Pattern';
import playContext from '../../System/context';
import Pad from './abstractPad';
import { WRITE, PATTERN_UPDATE, PATTERNS, PATTERN_IDX, CANCEL } from '../../System/_utils';
import NotesPad from './NotesPad';
import NumberPad from './_numberPad';

// Primary composition pad
// Writes 16 step sequences to loop
const SequencePad = () => {
  const { state, dispatch } = useContext(playContext);
  const [ newSequenceValue, updateNewValue ] = useState({});
  const [copyValue, setCopyValue] = useState(null);
  const pattern = useMemo(() => {
    return state[PATTERNS][state[PATTERN_IDX]];
   }, [state[PATTERNS], state[PATTERN_IDX]]);
  const patternType = state.patternType;

  // clear on cancel
  useEffect(() => {
    if (state.lastAction === CANCEL) {
      updateNewValue({});
      setCopyValue(null);
    }
  }, [state])

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

  const onSelectNote = useCallback((e) => {
    const value = e.currentTarget.dataset.value;
    if (state.patternType === 'drums') {
      updatePattern({ ...newSequenceValue, note: value});
    } else {
      updateNewValue({ ...newSequenceValue, note: value });
    }
  }, [newSequenceValue]);

  const onSelectLength = useCallback((e) => {
    const value = +e.currentTarget.dataset.value;
    updatePattern({ ...newSequenceValue, span: value });
  }, [newSequenceValue]);


  console.log(pattern[patternType])
  return state[WRITE] && (
    <Pad> 
      {typeof newSequenceValue.idx !== 'number'
        && pattern
        && pattern[patternType]
        && pattern[patternType].map((note, idx) =>
        <PatternCell
          {...note}
          onClick={onSelectStep}
          // onHold={!copyValue && updateCopyValue}
          // onHoldCancel={updateCopyValue}
          key={idx}
          idx={idx}
          display={note ? JSON.stringify(note)  : null}
          action={PATTERN_UPDATE}
          secondaryAction={'copy_note'}
        />
      )}
      {typeof newSequenceValue.idx === 'number' && !newSequenceValue.note && (
        <NotesPad onClick={onSelectNote} action={'pattern_entry_note'} />
      )}
      {typeof newSequenceValue.idx === 'number' && newSequenceValue.note && (
        <NumberPad onClick={onSelectLength} action={'pattern_entry_length'} displayValue />
      )}
    </Pad>
  );
};

export default SequencePad;
