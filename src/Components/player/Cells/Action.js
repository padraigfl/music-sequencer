import React from 'react';
import Cell from './abstractCell.js';

const ActionButton = (props) => {
  return (
    <Cell
      onClick={props.onClick}
      action={props.id}
      isActive={props.isActive}
      action={props.id}
      secondaryAction={props.secondaryAction}
      buttonId={`action--${props.id}`}
      idx={props.idx}
      display={
        props.display
        || `${props.id}${typeof props.value !== 'undefined' ? props.value : ''}`
      }
      height={props.height}
      width={props.width}
      icon={props.icon}
    />
  )
};

export default ActionButton;
