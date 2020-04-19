import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import MeterWrapper from './abstractMeter';
import { getCorrectParent } from '../_utils';

const TouchGridMap = styled('div')`
  display: grid;
  background-color: #ddd;
  grid: ${
    ({ rows, cols }) =>
      `repeat(${rows}, ${100/rows}%) / repeat(${cols}, ${100/cols}%)`
  };
  > div { border: 1px solid blue; }
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: relative;
  ${ ({ rows }) => `
    > div[data-y]:nth-child(${rows}n + 1){
      position: relative;
      &::after{
        position: absolute;
        width: 100%;
        content: attr(data-y);
        text-align: right;
      }
    }
  `}
`;

const ValueDisplay = styled('div')`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  font-size: 40px;top: 0px;
  left: 0px;
  z-index: 1000;
  display: flex;
  align-content: center;
  align-items: center;
`

// @todo, get x y value on move/release
// @todo reverse columns reverse rows via grid
const DragGrid = (props) => {
  const [activeValue, setActiveValue ] = useState(10);
  const gridRef = useRef(null);

  const getActionCell = useCallback(getCorrectParent(gridRef), []);

  const onRelease = React.useCallback((e) => {
    const focusedCell = getActionCell(e.target).dataset;
    props.onRelease(focusedCell);
    props.onCancel();
  }, [props.onRelease]);

  const onMove = React.useCallback((e) => {
    const focusedCell = getActionCell(e.target).dataset;
    setActiveValue(focusedCell);
    if (props.onMove) {
      props.onMove(focusedCell);
    }
  }, [props.onMove]);

  return (
    <MeterWrapper onCancel={props.onCancel} pad={props.pad}>
      <TouchGridMap
        onMouseMove={onMove}
        onMouseUp={onRelease}
        rows={props.rows || 1}
        cols={props.cols || 1}
        ref={gridRef}
      >
        {props.cells.map(v => <div {...v} />)}
      </TouchGridMap>
      { activeValue && (
        <ValueDisplay>{JSON.stringify(activeValue)}</ValueDisplay>
      )}
    </MeterWrapper>
  );
}

export default DragGrid;