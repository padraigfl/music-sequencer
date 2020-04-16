import React, {
  useContext,
} from 'react';
import Pad from './abstractPad';
import { SOUNDS_SET, SOUNDS_VIEW } from '../../System/_utils';
import playerContext from '../../System/Tone';
import Cell from '../Cells/abstractCell';

const SoundsPad = () => {
  const { sounds, state, dispatch } = useContext(playerContext);

  return state.view === SOUNDS_VIEW && (
    <Pad> 
      { sounds.map(note => <Cell key={note.id} onClick={() => dispatch({ type: SOUNDS_SET, value: note.id })}>{note.name}</Cell>) }
    </Pad>
  )
};

export default SoundsPad;
