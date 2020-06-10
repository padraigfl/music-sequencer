import React, {
  useContext, useCallback, useMemo,
} from 'react';
import Pad from './abstractPad';
import { SOUNDS_SET, SOUNDS_VIEW, SOUND } from '../../System/_constants';
import playerContext from '../../System/context';
import Cell from '../Cells/abstractCell.js';

// Selects the sound to work with live
const SoundsPad = () => {
  const { sounds, state, dispatch } = useContext(playerContext);
  const fireDispatch = useCallback((e) => {
    const idx = +e.currentTarget.dataset.idx;
    dispatch({ type: SOUNDS_SET, value: idx });
  }, [])

  return state.view === SOUNDS_VIEW && (
    <Pad> 
      { sounds.map((sound, idx) => (
          useMemo(() => (
            <Cell
              key={sound.id}
              onClick={fireDispatch}
              action={SOUNDS_SET}
              highlight={state[SOUND] === idx}
              idx={idx}
              display={sound.name}
            />
          ), [state[SOUND], sounds])
        ))
      }
    </Pad>
  )
};

export default SoundsPad;
