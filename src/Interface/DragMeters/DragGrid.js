import React, {
  useCallback,
  useRef,
  useMemo,
} from 'react';
import styled from 'styled-components';
import MeterWrapper from './abstractMeter';
import { getCorrectParent } from '../_utils';

const TouchGridMap = styled('div')`
  display: grid;
  grid: ${
    ({ rows, cols }) =>
      `repeat(${rows}, ${100/rows}%) / repeat(${cols}, ${100/cols}%)`
  };
  > div { border: 1px solid blue; }
  width: 100%;
  height: 100%;
  z-index: 10;
  position: relative;
`;

// @todo, get x y value on move/release
// @todo reverse columns reverse rows via grid
const DragGrid = (props) => {
  const gridRef = useRef(null);

  const getActionCell = useCallback(getCorrectParent(gridRef), []);

  const onRelease = React.useCallback((e) => {
    const focusedCell = getActionCell(e.target).dataset;
    console.log(focusedCell);
    props.onRelease(focusedCell);
    props.onCancel();
  }, [props.onRelease]);

  const onMove = React.useCallback((e) => {
    const focusedCell = getActionCell(e.target).dataset;
    props.onMove(focusedCell);
  }, [props.onMove]);

  return (
    <MeterWrapper onCancel={props.onCancel} pad={props.pad}>
      <TouchGridMap
        onMouseMove={props.onMove ? onMove : undefined}
        onMouseUp={onRelease}
        rows={props.rows || 1}
        cols={props.cols || 1}
        ref={gridRef}
      >
        {props.cells.map(v => <div {...v} />)}
      </TouchGridMap>
    </MeterWrapper>
  );
}

export default DragGrid;