import * as React from 'react';
import Cell from './abstractCell.js';

type ActionButtonProps = {
  onClick: Function;
  secondaryAction?: string;
  id: string;
  height?: number;
  width?: number;
  icon?: string;
  display?: any;
  value?: any;
  isActive?: boolean;
};

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  return (
    <Cell
      onClick={props.onClick}
      action={props.id}
      isActive={props.isActive}
      secondaryAction={props.secondaryAction}
      buttonId={`action--${props.id}`}
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
