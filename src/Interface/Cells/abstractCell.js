import React, {
  useCallback,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

const DefaultCell = styled('button')`
  background-color: rgba(240, 240, 240, 0.9);
  margin: 4px;
  ${(props) => props.live ?
      `
        box-shadow: inset 0 0 30px 0px lightblue;
        border: none;
      `
    : ''
  };

`;

const Cell = (props) => {
  const [actionVisible, setActionVisible] = useState(false);
  const onCancel = useCallback(() => setActionVisible(false), []);

  const debounce = useRef(null);

  const onMouseDown = useCallback((e) => {
    debounce.current = setTimeout(() => {
      setActionVisible(true);
    }, 300)
  }, []);

  const cancelTimeout = useCallback(() => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
  }, []);

  const onClick = useCallback((e) => {
    if (!debounce.current || !props.drag) {
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
        onMouseDown={props.drag ? onMouseDown : props.onMouseDown}
        onMouseUp={props.drag ? cancelTimeout : props.onMouseUp}
        onTouchStart={props.drag ? onMouseDown : undefined}
        onTouchEnd={props.drag ? cancelTimeout : undefined}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        data-type={props.action}
        data-value={props.value}
        data-active={props.isActive ? true : undefined}
        live={props.live}
      >
        {
          props.children
          ? props.children
          : (
            <>
              {props.isActive && props.activeChildren}
              { (!props.isActive || !props.activeChildren) && 
                <div>{props.id}{props.value}</div>
              }
            </>
          )
        }
      </props.Component>
      { actionVisible ? (
          <props.drag.Component
            {...props.drag.props }
            onCancel={onCancel}
          />
        ) : undefined
      }
    </>
  )
}

Cell.defaultProps = {
  Component: DefaultCell,
}

export default Cell;
