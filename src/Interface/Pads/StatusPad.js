import React, {
  useState,
} from 'react';
import Pad from './abstractPad';
import styled from 'styled-components';

const cells = new Array(16).fill(null);

const green = '#00FF00';
const greenLow = '#008800';
const red = '#FF0000';
const redLow = '#880000';

const multiOutline = (outlines) => {
  let i = 0;
  const multi = outlines.map(({ o = 0, b = 0, c = green }) => {
    const edge = i+o;
    const val = `0px 0px 0px ${i + 1}px #222, 0px 0px ${b}px ${edge}px ${c}`;
    i = edge;
    return val;
  });
  return multi.join(', ');
}

const StatusCell = styled('div')`
  box-shadow: ${multiOutline([{ o: 3, c: greenLow }, { o: 3, c: redLow }])};
  pointer-events: none;
  &.green {
    box-shadow: ${multiOutline([{ o: 4, c: green }, { o: 2, c: redLow }])};
  }
  &.red {
    box-shadow: ${multiOutline([{ o: 3, c: greenLow }, { o: 4, c: red }])};
  }
  &.red.green {
    box-shadow: ${multiOutline([{ o: 4, c: green }, { o: 3, c: red }])};
  }
  &.live {
    background-color: white;
  }
`;

const StatusPad = (props) => {
  return (
    <Pad entries={16}>
      {cells.map((_, idx) => <StatusCell className="cell" id={`live-status--${idx}`} idx={idx} key={idx} />)}
    </Pad>
  )
};

export default StatusPad;
