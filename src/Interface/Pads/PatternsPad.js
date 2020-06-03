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
  HOLD,
} from '../../System/_utils';
import NumberPad from './_numberPad';

// Pad for selecting patterns
// Depending on state this controls which pattern you wish to edit or how to chain them
const PatternsPad = () => {
  const freshChain = useRef(false);
  const { dispatch, state, patternSet } = useContext(playerContext);
  useEffect(() => {
    freshChain.current = true; 
  }, [state.view])

  const chainHandler = useCallback((value) => {
    const newPatternChain = !freshChain.current
      ? [...state[PATTERN_CHAIN], value]
      : [value];
    dispatch({
      type: PATTERN_UPDATE,
      value: newPatternChain,
    });
    freshChain.current = false;
  }, []);

  const onClick = useCallback((e) => {
    const clickValue = +e.currentTarget.dataset.value;
    if (state[HOLD] !== PATTERN_VIEW) {
      dispatch({
        type: PATTERN_SET,
        value: clickValue,
      });
    } else {
      chainHandler(clickValue);
    }
  }, [state]);

  return state.view === PATTERN_VIEW && (
    <NumberPad
      onClick={onClick}
      secondaryAction={'copy_pattern'}
      action={PATTERN_SET}
      displayValue
    />
  )
};

export default PatternsPad;
