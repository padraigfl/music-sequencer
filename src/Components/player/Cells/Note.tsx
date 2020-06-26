import * as React from 'react';
import Cell from './abstractCell';
import playerContext from '../../../Core/context';
import { SOUND } from '../../../Core/_constants';

interface NoteButtonProps {
  id: string;
  onClick?: Function;
  onHold?: Function;
  onRelease?: Function;
  action?: string;
  secondaryAction?: string;
  idx: number;
  ref?: any;
};

const NoteButton: React.FC<NoteButtonProps> = (props) => {
  const [playing, setPlayStatus] = React.useState(false);
  const { synthAction, sounds, state } = React.useContext(playerContext);
  const debounce = React.useRef(null);
  const noteRef = React.useRef(null);

  // needs debouncers
  const onDragEnter = React.useCallback((e) => {
    if (e.buttons === 1) {
      debounce.current = setTimeout(() => {
        noteRef.current.focus();
        setPlayStatus(true);
        synthAction(props.id, 'attack');
        debounce.current = null;
      }, 40);
    }
  }, [synthAction]);

  const onDragExit = React.useCallback((e) => {
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

  const onMouseUp = React.useCallback((e) => {
    setPlayStatus(false);
    noteRef.current.blur();
    synthAction(props.id, 'release');
  }, [synthAction, setPlayStatus]);

  const onMouseDown = React.useCallback((e) => {
    setPlayStatus(true);
    synthAction(props.id, 'attack');
  }, [synthAction, setPlayStatus]);

  const actions = React.useMemo(() => {
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
      display={(
        sounds[state[SOUND]].keys
        && sounds[state[SOUND]].keys[props.idx]
      ) || props.id}
      action={props.action}
      idx={props.idx}
      noTouch={!props.onHold}
      // value={state[SOUND] === 15 ? sounds[state[SOUND]].keys[props.idx] : props.id}
    />
  )
};

export default NoteButton;
