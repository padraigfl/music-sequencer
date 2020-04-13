import React, {
  useMemo,
} from 'react';
import styled from 'styled-components';
import DragGrid from './DragGrid';

// @todo, get x y value on move/release
// @todo reverse columns reverse rows via grid
const XYGrid = (props) => {
  const { rows, cols, ...restProps} = props;
  const rowData = useMemo(() => Array.isArray(props.rows) ? props.rows : new Array(props.rows).fill(null), [rows]);
  const colData = useMemo(() => Array.isArray(props.cols) ? props.cols : new Array(props.cols).fill(null), [cols]);
  const cells = rowData.map((row, rowNumber) => (
    colData.map((col, colNumber) => ({
      key: `grid_${rowNumber}_${colNumber}`,
      id: `grid_${rowNumber}_${colNumber}`,
      className: `mouseOverRow--${rowNumber} mouseOverCell--${colNumber}`,
      'data-y': rowData.length - rowNumber,
      'data-x': cols.length - (colData.length - colNumber),
      'data-count':  (rowData.length * colData.length) - ((rowData.length * rowNumber) + colNumber),
      'data-value': `${row}_${col}`,
    }))
  ))
  return (
    <DragGrid
      {...restProps}
      rows={rows.length}
      cols={cols.length}
      cells={cells}
    />
  );
}

export default XYGrid;