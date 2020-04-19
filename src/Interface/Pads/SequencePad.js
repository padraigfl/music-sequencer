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
import { WRITE, PATTERN_UPDATE, PATTERNS, PATTERN_IDX } from '../../System/_utils';


const SequencePad = () => {
  const { state, dispatch } = useContext(playContext);
  const pattern = useMemo(() => state[PATTERNS][state[PATTERN_IDX]], [state[PATTERNS], state[PATTERN_IDX]]);
  const patternType = state.patternType;

  const initalPattern = useMemo(() => (
    JSON.parse(JSON.stringify(state[PATTERNS][state[PATTERN_IDX]]))
  ), [state[PATTERN_IDX]]);

  const dragType = useMemo(() => {
    if (state[PATTERN_IDX] === 15) {
      return 'drum';
    }
    return 'note';
   }, [state[PATTERN_IDX]]);

  const updatePattern = useCallback((updateData) => {
    dispatch({
      type: PATTERN_UPDATE,
      value: {
        update: updateData,
      }
    });
  }, []);

  return state.view === WRITE && (
    <Pad> 
      {pattern && pattern[patternType] && pattern[patternType].map((note, idx) =>
        <PatternCell
          {...note}
          updatePattern={updatePattern}
          key={idx}
          idx={idx}
          activeValue={note ? JSON.stringify(note)  : null}
          dragType={dragType}
        />
      )}
    </Pad>
  );
};

export default SequencePad;
