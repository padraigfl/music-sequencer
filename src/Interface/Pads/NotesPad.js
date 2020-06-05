import React, {
  useState,
  useEffect,
} from 'react';
import Note from '../Cells/Note';
import { generateKeys } from '../../System/_utils';
import Pad from './abstractPad';

// Lists available notes in selected sound
// Used for:
// - Live playing
// - Selecting notes in sequencer
// Default displayed pad
const NotesPad = (props) => {
  const [keys, setKeys] = useState(generateKeys(props.octave));

  useEffect(() => {
    const k = generateKeys(props.octave);
    setKeys(
      [3,2,1,0].map(v => (
        k.slice(v * 4, (v+1) * 4)
      )).flat(1)
    );
  }, [props.octave]);

  return (
    <Pad> 
      { keys.map((note, idx) => (
          <Note
            key={note.id}
            idx={idx}
            {...note}
            onClick={props.onClick}
            action={props.onClick ? props.action : undefined}
          />
        ))
      }
    </Pad>
  )
};

export default NotesPad;
