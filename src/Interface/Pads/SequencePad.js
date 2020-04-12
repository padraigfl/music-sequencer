import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'react';
import PatternCell from '../Cells/Pattern';
import { getEmptyPattern } from '../_utils';
import playContext from '../../System/Tone';
import Pad from './abstractPad';
import { WRITE } from '../../System/_utils';

// @todo more complex overwrites passed in by context?
const overwritePattern = (pattern, updateData, index) => {
  const { note, length } = updateData;
  return [
    ...pattern.slice(0, index),
    { note, length },
    ...pattern.slice(index + 1),
  ]
};

const PlayPad = ({ patterns = {}, patternIdx = 0 }) => {
  const [pattern, setPattern] = useState(patterns[patternIdx] || getEmptyPattern());
  const [lastNote, setNote] = useState('C3');
  const context = useContext(playContext);

  useEffect(() => {
    setPattern(patterns[patternIdx]  || getEmptyPattern());
  }, [patternIdx]);

  useEffect(() => {
    context.updatePattern(pattern, patternIdx);
  }, [pattern]);

  const updatePattern = useCallback((index) => (updateData) => {
    const newPattern = overwritePattern(pattern, updateData, index);
    setNote(updateData.note);
    setPattern(newPattern);
  }, [pattern]);

  return context.state[WRITE] && (
    <Pad> 
      {pattern && pattern.spots && pattern.spots.map((note, idx) =>
        <PatternCell {...note} updatePattern={updatePattern} key={idx} lastNote={lastNote} />
      )}
    </Pad>
  )
};

export default PlayPad;
