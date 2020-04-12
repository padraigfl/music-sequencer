import React, {
  useCallback,
  useRef,
  useMemo,
} from 'react';
import styled from 'styled-components';
import MeterWrapper from './abstractMeter';

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

const getCorrectParent = (gridRef) => (currentEl) => {
  const gridEl = gridRef.current;
  if (!currentEl.parentNode) {
    throw Error('Out of range selection');
  }
  if (currentEl.parentNode === gridEl) {
    return currentEl;
  }
  return getCorrectParent(gridRef)(currentEl.parentNode);
}

// @todo, get x y value on move/release
// @todo reverse columns reverse rows via grid
const XYGrid = (props) => {
  const rows = useMemo(() => Array.isArray(props.rows) ? props.rows : new Array(props.rows).fill(null), [props.rows]);
  const cols = useMemo(() => Array.isArray(props.cols) ? props.cols : new Array(props.cols).fill(null), [props.cols]);
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
  }, [props.onMove])

  return (
    <MeterWrapper onCancel={props.onCancel} pad={props.pad}>
      <TouchGridMap
        onMouseMove={props.onMove ? onMove : undefined}
        onMouseUp={onRelease}
        rows={rows.length}
        cols={cols.length}
        ref={gridRef}
      >
        { rows.map((row, rowNumber) => (
          cols.map((col, colNumber) => (
            <div
              key={`grid_${rowNumber}_${colNumber}`}
              id={`grid_${rowNumber}_${colNumber}`}
              className={`mouseOverRow--${rowNumber} mouseOverCell--${colNumber}`}
              data-y={rows.length - rowNumber}
              data-x={cols.length - (cols.length - colNumber)}
              data-count={ (rows.length * cols.length) - ((rows.length * rowNumber) + colNumber)}
              data-value={`${row}_${col}`}
            />
          ))
        ))}
      </TouchGridMap>
    </MeterWrapper>
  );
}

export default XYGrid;