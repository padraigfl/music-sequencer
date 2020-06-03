import React, {
  useContext,
} from 'react';
import Pad from './abstractPad';
import { SOUNDS_SET, SOUNDS_VIEW, SOUND } from '../../System/_utils';
import playerContext from '../../System/context';
import Cell from '../Cells/abstractCell';

// Selects the sound to work with live
const SoundsPad = () => {
  const { sounds, state, dispatch } = useContext(playerContext);

  return state.view === SOUNDS_VIEW && (
    <Pad> 
      { sounds.map((note, idx) => (
          <Cell
            key={note.id}
            onClick={() => dispatch({ type: SOUNDS_SET, value: note.id })}
            action={SOUNDS_SET}
            isActive={state[SOUND] === idx}
          >
            {note.name}
          </Cell>
        ))
      }
    </Pad>
  )
};

export default SoundsPad;
