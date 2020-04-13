import React, {
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import Cell from './abstractCell';
import playerContext from '../../System/Tone';

const NoteButton = (props) => {
  const [playing, setPlayStatus] = useState(false);
  const { synthAction } = useContext(playerContext);
  const debounce = useRef(null);

  // needs debouncers
  const onDragEnter = useCallback((e) => {
    if (e.buttons === 1) {
      debounce.current = setTimeout(() => {
        setPlayStatus(true);
        synthAction(props.id, 'attack');
      }, 80);
    }
  }, [synthAction]);

  const onDragExit = useCallback((e) => {
    if (e.buttons === 1) {
      if (debounce.current) {
        clearTimeout(debounce.current);
        console.log('cancel', props.id);
      }
      synthAction(props.id);
      setPlayStatus(false);
    }
  }, [synthAction]);

  const onMouseUp = useCallback((e) => {
      setPlayStatus(false);
      synthAction(props.id);
  }, [synthAction]);

  const onMouseDown = useCallback((e) => {
    setPlayStatus(true);
    synthAction(props.id, 'attack');
  }, [synthAction]);


  return (
    <Cell
      // onClick={() => synthAction(props.id, 'attack')}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseEnter={onDragEnter}
      onMouseLeave={onDragExit}
      live={playing}
    >
      {props.isActive && props.activeChildren}
      { (!props.isActive || !props.activeChildren) && 
        <div>{props.id}{props.value}</div>
      }
    </Cell>
  )
};

export default NoteButton;
