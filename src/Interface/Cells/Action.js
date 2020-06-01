import React from 'react';
import Cell from './abstractCell';

const ActionButton = (props) => {
  return (
    <Cell
      onClick={props.onClick ? props.onClick : undefined}
      onHold={props.onHold}
      action={props.id}
      isActive={props.isActive}
      width={2}
    >
      {props.isActive && props.activeChildren}
      { (!props.isActive || !props.activeChildren) && 
        <div>{props.id}{props.value}</div>
      }
    </Cell>
  )
};

export default ActionButton;
