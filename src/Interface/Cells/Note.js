import React, {
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import Cell from './abstractCell';
import playerContext from '../../System/context';
import { SOUND } from '../../System/_utils';

const NoteButton = (props) => {
  const [playing, setPlayStatus] = useState(false);
  const { synthAction, sounds, state } = useContext(playerContext);
  const debounce = useRef(null);
  const noteRef = useRef(null);

  // needs debouncers
  const onDragEnter = useCallback((e) => {
    if (e.buttons === 1) {
      debounce.current = setTimeout(() => {
        noteRef.current.focus();
        setPlayStatus(true);
        synthAction(props.id, 'attack');
      }, 40);
    }
  }, [synthAction]);

  const onDragExit = useCallback((e) => {
    if (e.buttons === 1) {
      if (debounce.current) {
        clearTimeout(debounce.current);
        console.log('cancel', props.id);
      }
      console.log(noteRef.current);
      noteRef.current.blur();
      synthAction(props.id);
      setPlayStatus(false);
    }
  }, [synthAction]);

  const onMouseUp = useCallback((e) => {
      setPlayStatus(false);
      noteRef.current.blur();
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
      ref={noteRef}
      isActive={playing}
    >
      {state[SOUND] === 15 ? sounds[state[SOUND]].keys[props.idx] : props.id}
    </Cell>
  )
};

export default NoteButton;
