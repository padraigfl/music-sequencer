import React, {
  useCallback,
  useContext,
  useRef,
  useState,
  useMemo,
} from 'react';
import Cell from './abstractCell.js';
import playerContext from '../../Core/context';
import { SOUND, PATTERN_TYPE } from '../../Core/_constants';

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
        debounce.current = null;
      }, 40);
    }
  }, [synthAction]);

  const onDragExit = useCallback((e) => {
    if (e.buttons === 1) {
      if (debounce.current) {
        clearTimeout(debounce.current);
        debounce.current = null;
      }
      console.log(noteRef.current);
      noteRef.current.blur();
      synthAction(props.id);
    }
    setPlayStatus(false);
  }, [synthAction, setPlayStatus]);

  const onMouseUp = useCallback((e) => {
    setPlayStatus(false);
    noteRef.current.blur();
    synthAction(props.id, 'release');
  }, [synthAction, setPlayStatus]);

  const onMouseDown = useCallback((e) => {
    setPlayStatus(true);
    synthAction(props.id, 'attack');
  }, [synthAction, setPlayStatus]);

  const actions = useMemo(() => {
    return props.onClick
      ? {
        onClick: props.onClick,
        onHold: props.onHold,
        onRelease: props.onRelease,
      }
      : {
        onClick: () => {
          if (debounce.current) {
            clearTimeout(debounce.current);
            debounce.current = null;
            synthAction(props.id, 'attack', '8n');
          }
        },
        onHold: onMouseDown,
        onRelease: onMouseUp,
        onMouseEnter: onDragEnter,
        onMouseLeave: onDragExit,
      }
  }, [props.onClick]);

  return (
    <Cell
      { ...actions }
      ref={noteRef}
      isActive={playing}
      value={props.id}
      display={state[PATTERN_TYPE] !== 'spots'  ? sounds[state[SOUND]].keys[props.idx] : props.id}
      action={props.action}
      idx={props.idx}
      noTouch
      // value={state[SOUND] === 15 ? sounds[state[SOUND]].keys[props.idx] : props.id}
    />
  )
};

export default NoteButton;
