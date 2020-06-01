import React, {
  useCallback,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

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
`;

const Cell = React.forwardRef((props, ref) => {
  const debounce = useRef(null);

  const onMouseDown = useCallback((e) => {
    debounce.current = setTimeout(() => {
      setActionVisible(true);
    }, 300)
  }, []);

  const onTouchStart = useCallback((e) => {
    debounce.current = setTimeout(() => {
      props.onHold(e);
    }, 300)
  }, []);

  const cancelTimeout = useCallback(() => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    } else if (props.onCancelHold) {
      props.onCancelHold();
    }
  }, []);

  const onClick = useCallback((e) => {
    if (!debounce.current && !props.onHold) {
      props.onClick(e);
    } else if (debounce.current) {
      clearTimeout(debounce.current);
      props.onClick(e);
    }
  }, []);

  return (
    <>
      <props.Component
        type="button"
        onClick={props.onClick ? onClick : undefined}
        onMouseDown={props.onHold ? onMouseDown : props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onTouchStart={props.onHold ? onTouchStart : undefined}
        onTouchEnd={props.onHold ? cancelTimeout : undefined}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        data-type={props.action}
        data-value={props.value}
        data-active={props.isActive ? true : undefined}
        live={props.live}
        ref={ref}
      >
        {
          props.children
          ? props.children
          : (
            <>
              {props.isActive && props.activeChildren}
              { (!props.isActive || !props.activeChildren) && 
                <span>{props.id}{props.value}</span>
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
