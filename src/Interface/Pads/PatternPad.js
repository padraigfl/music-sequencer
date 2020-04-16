import React, {
  useContext,
  useCallback,
} from 'react';
import Pad from './abstractPad';
import playerContext from '../../System/Tone';
import Cell from '../Cells/abstractCell';
import { PATTERN_VIEW } from '../../System/_utils';

const NumberPad = (props) => {
  const { state, patternSet } = useContext(playerContext);
  const onClick = useCallback((e) => {
    patternSet(+e.currentTarget.dataset.value);
  }, []);
  return state.view === PATTERN_VIEW && (
    <Pad> 
      { new Array(16).fill(null).map((_, idx) => (
          <Cell
            key={idx}
            onClick={onClick}
            value={idx}
          >
            { idx + 1}
          </Cell>
        ))
      }
    </Pad>
  )
};

export default NumberPad;
