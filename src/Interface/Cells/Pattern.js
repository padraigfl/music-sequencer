import React, {
  useCallback,
  useMemo,
} from 'react';
import Cell from './abstractCell';
import { notes } from '../../tools/_player';

const getNote = (updateData, base = 3) => {
  if (!updateData.y) {
    return null;
  }
  const note = notes[updateData.y % notes.length];
  const octave = base + Math.floor(updateData.y / notes.length);
  return `${note}${octave}`;
};

const getSpanFromGrid = (updateData) => {
  return updateData.x ? +updateData.x + 1 : 1;
};

const formatDataFromGrid = (updateData) => {
  const note = getNote(updateData);
  const span = getSpanFromGrid(updateData);
  return {
    note,
    span,
  };
}

// @todo pattern chaining is gonna take work
const PatternButton = (props) => {
  const onRelease = useCallback((updateData) => {
    const sanitizedData = updateData.x ? formatDataFromGrid(updateData) : updateData;
    props.updatePattern({
        ...sanitizedData,
        idx: props.idx,
    });
  }, []);

  const onClick = useCallback((e) => {
    props.onClick(e);
  }, []);

  return (
    <Cell
      type="button"
      onClick={onClick}
      value={props.idx}
    >
      {props.isActive && props.activeChildren}
      { (!props.isActive || !props.activeChildren) && 
        <span>{props.id}{props.activeValue}</span>
      }
    </Cell>
  )
};

export default PatternButton;
