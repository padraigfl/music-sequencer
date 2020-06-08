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
  const [keys, setKeys] = useState(generateKeys(props.octave).map((v, idx) => ({...v, idx })));
  return (
    <Pad bold={props.bold} italic={props.italic} activeChildIdx={props.activeChildIdx}> 
      { keys.map((note) => (
          <Note
            key={note.id}
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
