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
  const pattern = useMemo(() => state[PATTERNS][state[PATTERN_IDX]], [state[PATTERNS], state[PATTERN_IDX]]);
  const patternType = state.patternType;

  const [ newSequenceValue, updateNewValue ] = useState({});

  useEffect(() => {
    if (state.lastAction === CANCEL) {
      updateNewValue({});
    }
  }, [state])

  const initalPattern = useMemo(() => (
    JSON.parse(JSON.stringify(state[PATTERNS][state[PATTERN_IDX]]))
  ), [state[PATTERN_IDX]]);

  const onSelectStep = useCallback((e) => {
    const idx = +e.currentTarget.dataset.value;
    updateNewValue({ idx });
  }, []);

  const onSelectNote = useCallback((e) => {
    const value = +e.currentTarget.dataset.value;
    updateNewValue({ ...newSequenceValue, note: value });
    if (state.patternType === 'drums') {
      // action
    }
  }, [newSequenceValue]);

  const onSelectLength = useCallback((e) => {
    const value = +e.currentTarget.dataset.value;
    //action
    dispatch({
      type: PATTERN_UPDATE,
      value: [
        ...state[PATTERNS][PATTERN_IDX].slice(0, currentState.idx),
        { note:newSequenceValue.note, span: value },
        ...state[PATTERNS][PATTERN_IDX].slice(currentState.idx + 1),
      ],
    });
  });
  console.log(newSequenceValue);

  return state[WRITE] && (
    <Pad> 
      {typeof newSequenceValue.idx !== 'number' && pattern && pattern[patternType] && pattern[patternType].map((note, idx) =>
        <PatternCell
          {...note}
          onClick={onSelectStep}
          // onHold = hold index action
          key={idx}
          idx={idx}
          activeValue={note ? JSON.stringify(note)  : null}
        />
      )}
      {typeof newSequenceValue.idx === 'number' && !newSequenceValue.note && (
        <NotesPad onClick={onSelectNote} />
      )}
      {typeof newSequenceValue.idx === 'number' && newSequenceValue.note && state[PATTERN_IDX] !== 15 && (
        <NumberPad onClick={onSelectLength} />
      )}
    </Pad>
  );
};

export default SequencePad;
