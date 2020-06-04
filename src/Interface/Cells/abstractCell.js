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
import { HOLD, HOLD_ACTION, HOLD_VALUE, MULTI_TOUCH } from '../../System/_utils';
import { getTouchValues } from '../_utils';


const buttonLight = (color) => (
  `background-color: ${color}; box-shadow: 0px 0px 9px ${color};`
)
const active = buttonLight('#aae0aa');
const temp = buttonLight('#9999d0');
const highlight = buttonLight('#ffe0e0');

const DefaultCell = styled('button')`
  @keyframes flash {
    0% { box-shadow: initial; }
    20% { box-shadow: 0px 0px 50px red; }
    70% { box-shadow: intiial; }
  }
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
    ${active}
  }
  &:focus {
    outline: none;
  }
  &:active, &[data-active] {
    ${active}
  }
  &[data-held] {
    ${temp}
  }
  &[data-held][data-active] {
    background-color: #aae0aa;
    box-shadow: 0px 0px 9px #9999d0, inset 0px 0px 4px 4px #9999d0;
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

const holdTime = 400;



/**
 * As desktop cannot do multitouch, a secondary system involving holding down buttons is required too
 */
const Cell = React.forwardRef((props, ref) => {
  const holdTimer = useRef(null);
  const [held, updateHeld] = useState(undefined);
  const { state, dispatch } = useContext(playerContext);

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

  const onMouseDown = useCallback(() => {
    console.log('md');
    holdTimer.current = setTimeout(() => {
      if (props.secondaryAction) {
        dispatch({
          type: HOLD,
          value: {
            action: props.secondaryAction,
            value: typeof props.value !== 'undefined' ? props.value : props.id,
          },
        });
      }
      holdTimer.current = null;
    }, holdTime);
  }, []);

  const onMouseUp = useCallback(() => {
    if (holdTimer.current && !props.onClick) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const onClick = useCallback((e) => {
    if (state[HOLD] && holdTimer.current) {
      clearTimeout(holdTimer.current);
      dispatch({
        type: HOLD_ACTION,
        value: props.value,
      });
    } else if (holdTimer.current) {
      console.log('click');
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
      if (props.onClick) {
        props.onClick(e);
      }
      return;
    }
  }, [props.onClick, state[HOLD], held]);

  const onTouchStart = useCallback((e) => {
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
    }, holdTime);
    if (held) {
      return;
    } else {
      console.log(getTouchValues(e));
      dispatch({
        type: MULTI_TOUCH,
        value: getTouchValues(e),
      });
    }
  }, [held]);

  const actionProps = useMemo(() => {
    return {
      onClick,
      onMouseDown: props.onHold || onMouseDown,
      onMouseUp: props.onRelease || onMouseUp,
      onTouchStart: props.onHold || onTouchStart,
      onTouchEnd: props.onRelease || onMouseUp,
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
    }
  }, [
    props.onClick,
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
