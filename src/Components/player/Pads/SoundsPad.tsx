import * as React from 'react';
import Pad from './abstractPad';
import { SOUNDS_SET, SOUNDS_VIEW, SOUND } from '../../../Core/_constants';
import playerContext from '../../../Core/context';
import Cell from '../Cells/abstractCell.js';

// Selects the sound to work with live
const SoundsPad: React.FC<null> = () => {
  const { sounds, state, dispatch } = React.useContext(playerContext);
  const fireDispatch = React.useCallback((e) => {
    const idx = +e.currentTarget.dataset.idx;
    dispatch({ type: SOUNDS_SET, value: idx });
  }, [])

  return state.view === SOUNDS_VIEW && (
    <Pad> 
      { React.useMemo(() => (
          sounds.map((sound, idx) => (
            <Cell
              key={sound.id+sound.name}
              onClick={fireDispatch}
              action={SOUNDS_SET}
              highlight={state[SOUND] === idx}
              idx={idx}
              display={sound.name}
            />
          ))),
          [state[SOUND], sounds],
        )
      }
    </Pad>
  )
};

export default SoundsPad;
