import React, {
  useState,
} from 'react';
import Pad from './abstractPad';
import styled from 'styled-components';

const cells = new Array(16).fill(null);

const StatusCell = styled('div')`
  box-shadow: 0px 0px 0px 1px #222, 0px 0px 0px 5px #008800, 0px 0px 0px 7px #880000;
  pointer-events: none;
  &.green {
    box-shadow: 0px 0px 0px 1px #222, 0px 0px 1px 5px #00FF00, 0px 0px 4px 7px #880000;
  }
  &.red {
    box-shadow: 0px 0px 0px 1px #222, 0px 0px 1px 5px #008800, 0px 0px 4px 9px #FF0000;
  }
  &.red.green {
    box-shadow: 0px 0px 0px 1px #222, 0px 0px 1px 5px #00FF00, 0px 0px 4px 9px #FF0000;
  }
  &.live {
    background-color: white;
  }
`;

const StatusPad = (props) => {
  return (
    <Pad entries={16}>
      {cells.map((_, idx) => <StatusCell className="cell" id={`live-status--${idx}`} key={idx} />)}
    </Pad>
  )
};

export default StatusPad;
