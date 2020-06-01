import React, {
  useCallback,
  useContext,
  useRef,
  useState,
  useMemo,
} from 'react';
import Cell from './abstractCell';
import playerContext from '../../System/context';
import { SOUND } from '../../System/_utils';

const NoteButton = (props) => {
  const [playing, setPlayStatus] = useState(false);
  const { synthAction, sounds, state, dispatch } = useContext(playerContext);
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

  const actions = useMemo(() => {
    return props.onClick
      ? { onClick: props.onClick }
      : {
        onMouseUp,
        onMouseDown,
        onMouseEnter: onDragEnter,
        onMouseExit: onDragExit,
      }
  }, [props.onClick]);

  return (
    <Cell
      { ...actions }
      ref={noteRef}
      isActive={playing}
      value={props.idx}
    >
      {state[SOUND] === 15 ? sounds[state[SOUND]].keys[props.idx] : props.id}
    </Cell>
  )
};

export default NoteButton;
