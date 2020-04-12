import React, {
  useCallback,
  useRef,
} from 'react';
import Cell from './abstractCell';
import XYGrid from '../DragMeters/XYGrid';

// @todo pattern chaining is gonna take work
const PatternButton = (props) => {
  const debounce = useRef(null);
  // drag timeout should be handled one level up?
  const onMouseDown = useCallback(() => {
    debounce.current = setTimeout(() => {
      props.setModifyFunction({
        type: 'note',
        action: props.updatePattern,
      });
    }, 300)
  }, [props.dragAction]);
  const cancelTimeout = useCallback(() => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
  }, []);
  const onClick = useCallback(() => {
    if (debounce.current) {
      clearTimeout(debounce.current);
      props.updatePattern({
        note: props.lastNote,
        duration: '1n', // @todo
        idx: props.key,
      });
    }
  }, []);

  const onRelease = useCallback((params) => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
    props.updatePattern(params);
  }, []);

  return (
    <Cell
      type="button"
      onClick={props.onClick ? onClick : undefined}
      onMouseDown={props.setModifyFunction ? onMouseDown : undefined}
      onMouseUp={props.setModifyFunction ? cancelTimeout : undefined}
      drag={{
        Component: XYGrid,
        props: {
          onRelease,
          rows: 16,
          cols: 16,
          pad: true,
        },
      }}
    >
      {props.isActive && props.activeChildren}
      { (!props.isActive || !props.activeChildren) && 
        <div>{props.id}{props.value}</div>
      }
    </Cell>
  )
};

export default PatternButton;
