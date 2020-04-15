import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useContext,
} from 'react';
import PatternCell from '../Cells/Pattern';
import playContext from '../../System/Tone';
import Pad from './abstractPad';
import { WRITE, PATTERN_UPDATE, PATTERNS, PATTERN_IDX } from '../../System/_utils';


const PlayPad = () => {
  const { state, dispatch } = useContext(playContext);
  const pattern = useMemo(() => state[PATTERNS][state[PATTERN_IDX]], [state[PATTERNS]]);

  const initalPattern = useMemo(() => (
    JSON.parse(JSON.stringify(state[PATTERNS][state[PATTERN_IDX]]))
  ), [state[PATTERN_IDX]]);

  const [lastNote, setNote] = useState('C3');

  const updatePattern = useCallback((updateData) => {
    setNote(updateData.note);
    dispatch({
      type: PATTERN_UPDATE,
      value: {
        update: updateData,
      }
    });
  }, []);

  return state[WRITE] && (
    <Pad> 
      {pattern && pattern.spots && pattern.spots.map((note, idx) =>
        <PatternCell
          {...note}
          updatePattern={updatePattern}
          key={idx}
          idx={idx}
          activeValue={note ? JSON.stringify(note)  : null}
        />
      )}
    </Pad>
  );
};

export default PlayPad;
