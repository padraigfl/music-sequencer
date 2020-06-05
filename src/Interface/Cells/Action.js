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
      idx={props.idx}
    >
      {props.isActive && props.activeChildren}
      { (!props.isActive || !props.activeChildren) && 
        <>{props.id}{props.value}</>
      }
    </Cell>
  )
};

export default ActionButton;
