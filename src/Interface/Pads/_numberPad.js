import React from 'react';
import Pad from './abstractPad';
import Cell from '../Cells/abstractCell';

const NumberPad = (props) => (
  <Pad> 
    { new Array(16).fill(null).map((_, idx) => (
        <Cell
          key={idx}
          onClick={props.onClick}
          onHold={props.onHold}
          onHoldCancel={props.onHoldCancel}
          secondaryAction={props.secondaryAction}
          value={idx}
          action={props.action}
        >
          { idx + 1}
        </Cell>
      ))
    }
  </Pad>
);

export default NumberPad;
