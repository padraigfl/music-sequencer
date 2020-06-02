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
    content: attr(data-value);
  }
`;

const Cell = React.forwardRef((props, ref) => {
  const debounce = useRef(null);
  const [held, updateHeld] = useState(undefined);
  const { updateMultiTouch, multiTouch } = useContext(playerContext);

  const updateHeldButtons = useCallback((clear) => {
    console.log('up')
    updateMultiTouch({ secondaryAction: props.secondaryAction, value: props.value, action: props.action }, { clear });
  }, [props.value, props.secondaryAction]);

  const onMouseDown = useCallback((e) => {
    debounce.current = setTimeout(() => {
      updateHeldButtons();
      updateHeld(true);
    }, 300)
  }, []);

  const onMouseUp = useCallback((e) => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
    console.log('mu')
  }, []);

  const onClick = useCallback((e) => {
    if (debounce.current) {
      clearTimeout(debounce.current);
      if (props.onClick) {
        props.onClick(e);
      }
      updateHeldButtons(true);
      updateHeld(false);
    }
  }, [props.onClick, held]);

  const actionProps = useMemo(() => {
    return {
      onClick: onClick,
      onMouseDown: props.onHold || onMouseDown,
      onMouseUp: props.onHoldRelease
        ? props.onHoldRelease
        : onMouseUp,
      onTouchStart: props.onHold || updateHeldButtons,
      onTouchEnd: props.onHoldRelease || (() => updateHeldButtons(true)),
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
    }
  }, [props.onClick, props.onHold, props.onHoldRelease, props.onMouseEnter, props.onMouseLeave]);

  return (
    <>
      <props.Component
        type="button"
        { ... actionProps }
        data-secondary={props.secondaryAction}
        data-display={props.display || props.value || props.id }
        data-value={props.value || props.id}
        data-action={props.action}
        data-active={props.isActive ? true : undefined}
        data-held={held}
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
