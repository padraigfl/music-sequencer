import * as React from 'react';
import Pad from './abstractPad';
import Cell from '../Cells/abstractCell';

type PadProps = {
  italic?: boolean;
  bold?: boolean;
  onClick?: Function;
  onHold?: Function;
  onRelease?: Function;
  secondaryAction?: string;
  action?: string;
  displayValue?: boolean;
  activeIdx?: number;
  activeChildIdx?: number;
  getHighlight?: Function;
}

const NumberPad: React.FC<PadProps> = (props) => (
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
          highlight={props.getHighlight ? props.getHighlight(idx) : undefined}
          value={idx}
        />
      ))
    }
  </Pad>
);

export default NumberPad;
