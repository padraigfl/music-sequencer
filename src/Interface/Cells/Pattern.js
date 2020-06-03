import React, {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import Cell from './abstractCell';
import { notes } from '../../tools/_player';

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
    />
  )
};

export default PatternButton;
