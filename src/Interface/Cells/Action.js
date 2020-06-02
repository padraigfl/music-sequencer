import React from 'react';
import Cell from './abstractCell';

const ActionButton = (props) => {
  return (
    <Cell
      onClick={props.onClick}
      action={props.id}
      isActive={props.isActive}
      width={2}
      action={props.id}
      secondaryAction={props.secondaryAction}
      buttonId={`action--${props.id}`}
    >
      {props.isActive && props.activeChildren}
      { (!props.isActive || !props.activeChildren) && 
        <span>{props.id}{props.value}</span>
      }
    </Cell>
  )
};

export default ActionButton;
