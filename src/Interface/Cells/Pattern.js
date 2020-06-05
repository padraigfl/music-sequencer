import React from 'react';
import Cell from './abstractCell';

// @todo pattern chaining is gonna take work
const PatternButton = (props) => {
  return (
    <Cell
      type="button"
      onClick={props.onClick}
      value={props.idx}
      action={props.action}
      display={props.display}
      secondaryAction={props.secondaryAction}
      isActive={props.highlight}
      idx={props.idx}
    />
  )
};

export default PatternButton;
