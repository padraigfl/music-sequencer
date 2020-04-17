import React, {
  useCallback,
  useMemo,
} from 'react';
import Cell from './abstractCell';
import XYGrid from '../DragMeters/XYGrid';
import { notes } from '../_utils';
import DragGrid from '../DragMeters/DragGrid';

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

const sampleDragPad = {
};

const noteDragPad = {

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

  const drag = useMemo(() => {
    if (props.dragType !== 'drum') {
      return {
        Component: XYGrid,
        props: {
          onRelease,
          rows: 16,
          cols: 16,
          pad: true,
        },
      }
    }
    return {
      Component: DragGrid,
      props: {
        onRelease,
        rows: 4,
        cols: 4,
        cells: new Array(16).fill({}).map((v, idx) => ({ children: idx })),
        pad: true,
      },
    }
  }, [props.dragType, onRelease])

  return (
    <Cell
      type="button"
      onClick={onClick}
      drag={drag}
    >
      {props.isActive && props.activeChildren}
      { (!props.isActive || !props.activeChildren) && 
        <div>{props.id}{props.activeValue}</div>
      }
    </Cell>
  )
};

export default PatternButton;
