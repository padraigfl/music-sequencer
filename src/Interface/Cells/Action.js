import React from 'react';
import Cell from './abstractCell';

const ActionButton = (props) => {
  return (
    <Cell
      onClick={props.onClick ? props.onClick : undefined}
      drag={props.drag}
      action={props.id}
      isActive={props.isActive}
    >
      {props.isActive && props.activeChildren}
      { (!props.isActive || !props.activeChildren) && 
        <div>{props.id}{props.value}</div>
      }
    </Cell>
  )
};

export default ActionButton;
