import React, {
  useState,
  useEffect,
} from 'react';
import Note from '../Cells/Note';
import { generateKeys } from '../../tools/_player';
import Pad from './abstractPad';

// Lists available notes in selected sound
// Used for:
// - Live playing
// - Selecting notes in sequencer
// Default displayed pad
const NotesPad = (props) => {
  const [keys, setKeys] = useState(generateKeys(props.octave));

  useEffect(() => {
    setKeys(generateKeys(props.octave));
  }, [props.octave]);

  return (
    <Pad style={{ flexWrap: 'wrap-reverse' }}> 
      { keys.map((note, idx) => (
          <Note
            key={note.id}
            idx={idx}
            {...note}
            onClick={props.onClick}
          />
        ))
      }
    </Pad>
  )
};

export default NotesPad;
