import * as React from 'react';
import Cell from './abstractCell';

type StepSequenceButtonProps = {
  onClick: Function;
  action: string;
  secondaryAction: string;
  isActive?: boolean;
  highlight?: boolean;
  idx: number;
  display?: any;
};

// @todo pattern chaining is gonna take work
const PatternButton: React.FC<StepSequenceButtonProps> = (props) => {
  return (
    <Cell
      onClick={props.onClick}
      value={props.idx}
      action={props.action}
      display={props.display}
      secondaryAction={props.secondaryAction}
      isActive={props.isActive}
      highlight={props.highlight}
      idx={props.idx}
    />
  )
};

export default PatternButton;
