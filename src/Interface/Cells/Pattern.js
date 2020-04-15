import React, {
  useCallback,
  useRef,
} from 'react';
import Cell from './abstractCell';
import XYGrid from '../DragMeters/XYGrid';
import { notes } from '../_utils';

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

  const onClick = useCallback(() => {
    props.updatePattern({
      note: props.lastNote,
      idx: props.idx,
    });
  }, [props.lastNote]);


  return (
    <Cell
      type="button"
      onClick={onClick}
      drag={{
        Component: XYGrid,
        props: {
          onRelease,
          rows: 16,
          cols: 16,
          pad: true,
        },
      }}
    >
      {props.isActive && props.activeChildren}
      { (!props.isActive || !props.activeChildren) && 
        <div>{props.id}{props.activeValue}</div>
      }
    </Cell>
  )
};

export default PatternButton;
