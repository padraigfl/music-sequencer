import * as React from 'react';
import Cell from './abstractCell';

type ActionButtonProps = {
  onClick: Function;
  id: string;
  height?: number;
  width?: number;
  icon?: string;
  display?: any;
  isActive?: boolean;
  secondaryAction?: string;
};

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  return (
    <Cell
      onClick={props.onClick}
      action={props.id}
      isActive={props.isActive}
      secondaryAction={props.secondaryAction}
      buttonId={`action--${props.id}`}
      display={props.display}
      height={props.height}
      width={props.width}
      icon={props.icon}
    />
  )
};

export default ActionButton;
