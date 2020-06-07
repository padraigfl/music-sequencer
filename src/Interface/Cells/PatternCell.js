import React from 'react';
import styled from 'styled-components';
import Cell from './abstractCell';
import Pad from '../Pads/abstractPad';

const iterator = new Array(16).fill(null);

const Spot = styled('span')`
  border-radius: 2px;
  border: 1px dashed #eee;
  ${props => {
    if (props.beat) {
      return `background-color: blue;`;
    }
    if (props.spot) {
      return `background-color: red;`;
    }
    return `background-color: transparent;`;
  }}
`;

const PatternView = styled('span')`
  display: grid;
  grid-gap: 1%;
  width: 100%;
  height: 100%;
  grid: repeat(4, 24%) / repeat(4, 24%);
  border-radius: 4px;
  user-select: none;
  pointer-event: none;
`

const PatternCell = ({ pattern, ...props}) => {
  return (
    <Cell {...props}>
      <PatternView>
        {iterator.map((_, idx) => (
          <Spot beat={pattern.drums[idx]} spot={pattern.spots[idx]} /> 
        ))}
      </PatternView>
    </Cell>
  );
};

export default PatternCell;
