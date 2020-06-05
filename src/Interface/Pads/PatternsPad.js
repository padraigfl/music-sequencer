import React, {
  useContext,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import playerContext from '../../System/context';
import {
  PATTERN_VIEW,
  PATTERN_CHAIN,
  PATTERN_SET,
  PATTERN_IDX,
  PATTERN_COPY,
} from '../../System/_constants';
import NumberPad from './_numberPad';

// Pad for selecting patterns
// Depending on state this controls which pattern you wish to edit or how to chain them
const PatternsPad = () => {
  const { dispatch, state } = useContext(playerContext);

  const onClick = useCallback((e) => {
    const clickValue = +e.currentTarget.dataset.value;
    dispatch({
      type: PATTERN_SET,
      value: clickValue,
    });
  }, [state]);

  return state.view === PATTERN_VIEW && (
    <NumberPad
      onClick={onClick}
      secondaryAction={PATTERN_COPY}
      action={PATTERN_SET}
      activeIdx={state[PATTERN_IDX]}
      highlight={idx => state[PATTERN_CHAIN].includes(idx)}
      displayValue
    />
  )
};

export default PatternsPad;
