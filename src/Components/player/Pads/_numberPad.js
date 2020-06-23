import React from 'react';
import Pad from './abstractPad';
import Cell from '../Cells/abstractCell.js';

const NumberPad = (props) => (
  <Pad bold={props.bold} italic={props.italic} activeChildIdx={props.activeChildIdx}> 
    { new Array(16).fill(null).map((_, idx) => (
        <Cell
          key={idx}
          onClick={props.onClick}
          onHold={props.onHold}
          onRelease={props.onRelease}
          secondaryAction={props.secondaryAction}
          action={props.action}
          display={props.displayValue ? (idx + 1).toString() : undefined}
          isActive={idx === props.activeIdx}
          live={props.getHighlight ? props.getHighlight(idx) : undefined}
          value={idx}
          idx={props.idx}
        />
      ))
    }
  </Pad>
);

export default NumberPad;
