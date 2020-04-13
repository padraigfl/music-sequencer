import React, {
  useContext,
} from 'react';
import Pad from './abstractPad';
import { SOUNDS_SET, SOUNDS_VIEW } from '../../System/_utils';
import playerContext from '../../System/Tone';

const SoundsPad = () => {
  const { sounds, state, dispatch } = useContext(playerContext);

  return state[SOUNDS_VIEW] && (
    <Pad> 
      { sounds.map(note => <button key={note.id} onClick={() => dispatch({ type: SOUNDS_SET, value: note.id })}>{note.name}</button>) }
    </Pad>
  )
};

export default SoundsPad;
