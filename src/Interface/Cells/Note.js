import React, {
  useCallback,
  useContext,
  useRef,
} from 'react';
import Cell from './abstractCell';
import playerContext from '../../System/Tone';

let x = 0;
const NoteButton = (props) => {
  const { synthAction } = useContext(playerContext);
  const debounce = useRef(null);

  // needs debouncers
  const onDragEnter = useCallback((e) => {
    if (e.buttons === 1) {
      debounce.current = setTimeout(() => {
        synthAction(props.id, 'attack');
      }, 80);
    }
  }, []);

  const onDragExit = useCallback((e) => {
    if (e.buttons === 1) {
      if (debounce.current) {
        clearTimeout(debounce.current);
        console.log('cancel', props.id);
      }
      synthAction(props.id);
    }
  }, []);


  return (
    <Cell
      // onClick={() => synthAction(props.id, 'attack')}
      onMouseUp={() => synthAction(props.id)}
      onMouseDown={() => synthAction(props.id, 'attack')}
      onMouseEnter={onDragEnter}
      onMouseLeave={onDragExit}
    >
      {props.isActive && props.activeChildren}
      { (!props.isActive || !props.activeChildren) && 
        <div>{props.id}{props.value}</div>
      }
    </Cell>
  )
};

export default NoteButton;
