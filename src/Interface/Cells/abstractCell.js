import React, {
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react';
import styled from 'styled-components';
import playerContext from '../../System/context';
import { HOLD, HOLD_ACTION, HOLD_VALUE } from '../../System/_utils';

const DefaultCell = styled('button')`
  background-color: #e8e8e8;  
  margin: 5px;
  word-wrap: break-word;
  ${(props) => props.live ?
      `
        box-shadow: inset 0 0 30px 0px lightblue;
        border: none;
      `
    : ''
  };
  &[data-active]:not(:active) {
    box-shadow: 0px 0px 8px #ffd0d0;
  }
  &:focus {
    outline: none;
  }
  &:active, &[data-active] {
    background-color: #ffe0e0;
  }
  &[data-held] {
    background-color: #9999d0 !important;
  }
  .pad & {
    &[data-active], &:focus {
      border: none;
      padding-top: 2px;
      padding-left: 2px;
      background-color: #eeeeee;
      box-shadow: 0px 0px 2px white;
    }
  }
  &:after {
    content: attr(data-display);
  }
`;

const Cell = React.forwardRef((props, ref) => {
  const debounce = useRef(null);
  const [held, updateHeld] = useState(undefined);
  const { state, dispatch } = useContext(playerContext);

  // no multitouch on desktop so I have to include all this nonsense...
  useEffect(() => {
    if (
      props.secondaryAction
      && state[HOLD] === props.secondaryAction
      && state[HOLD_VALUE] === (typeof props.value !== 'undefined' ? props.value : props.id)) {
      if (!held) {
        updateHeld(true);
      }
    } else if (held) {
      updateHeld(false);
    }
  }, [state[HOLD]]);

  const onMouseDown = useCallback((e) => {
    debounce.current = setTimeout(() => {
      if (props.secondaryAction) {
        dispatch({
          type: HOLD,
          value: {
            action: props.secondaryAction,
            value: props.value || props.id,
          },
        });
      }
    }, 300);
  }, []);

  const onMouseUp = useCallback((e) => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
  }, []);

  const onClick = useCallback((e) => {
    if (held) {
      return;
    }
    if (state[HOLD]) {
      console.log('test');
      dispatch({
        type: HOLD_ACTION,
        value: props.value,
      });
    } else if (debounce.current) {
      clearTimeout(debounce.current);
      if (props.onClick) {
        props.onClick(e);
      }
    }
  }, [props.onClick, state[HOLD], held]);

  const actionProps = useMemo(() => {
    return {
      onClick: onClick,
      onMouseDown: props.onHold ||onMouseDown,
      onMouseUp: props.onHoldRelease || onMouseUp,
      onTouchStart: props.onHold,
      onTouchEnd: props.onHoldRelease,
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
    }
  }, [
    props.onClick,
    props.onHold,
    props.onHoldRelease,
    props.onMouseEnter,
    props.onMouseLeave,
    state[HOLD],
    held,
  ]);

  return (
    <>
      <props.Component
        type="button"
        { ... actionProps }
        data-secondary={props.secondaryAction}
        data-display={props.display }
        data-value={typeof props.value !== 'undefined' ? props.value : props.id}
        data-action={props.action}
        data-active={props.isActive ? true : undefined}
        data-held={held ? true : undefined}
        live={props.live}
        ref={ref}
        id={props.buttonId}
      >
        {
          props.children
          ? props.children
          : (
            <>
              {props.isActive && props.activeChildren}
              { (!props.isActive || !props.activeChildren) && props.id && 
                <span>{props.id}</span>
              }
            </>
          )
        }
      </props.Component>
    </>
  )
});

Cell.defaultProps = {
  Component: DefaultCell,
}

export default Cell;
