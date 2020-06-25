import * as React from 'react';
import playerContext from '../../../Core/context';
import {
  PATTERN_VIEW,
  PATTERN_CHAIN,
  PATTERN_SET,
  PATTERN_IDX,
  PATTERN_COPY,
  PATTERNS,
} from '../../../Core/_constants';
import Pad from './abstractPad';
import PatternCell from '../Cells/PatternCell';

// Pad for selecting patterns
// Depending on state this controls which pattern you wish to edit or how to chain them
const PatternsPad = () => {
  const { dispatch, state } = React.useContext(playerContext);

  const onClick = React.useCallback((e: MouseEvent | TouchEvent) => {
    const clickValue = +(e.currentTarget as HTMLElement).dataset.value;
    dispatch({
      type: PATTERN_SET,
      value: clickValue,
    });
  }, [state]);

  return state.view === PATTERN_VIEW && (
    <Pad>
      {state[PATTERNS].map((v, idx) => (
        React.useMemo(() => (
          <PatternCell
            key={idx}
            pattern={v}
            onClick={onClick}
            secondaryAction={PATTERN_COPY}
            action={PATTERN_SET}
            isActive={state[PATTERN_IDX] === idx}
            value={idx}
            idx={idx}
          />
        ), [state[PATTERNS][idx], state[PATTERN_IDX], state[PATTERN_CHAIN]])
      ))}
    </Pad>
  )
};

export default PatternsPad;
