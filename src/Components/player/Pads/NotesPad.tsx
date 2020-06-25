import * as React from 'react';
import Note from '../Cells/Note';
import { generateKeys } from '../../../System/_utils';
import Pad from './abstractPad';
import playerContext from '../../../Core/context';

// Lists available notes in selected sound
// Used for:
// - Live playing
// - Selecting notes in sequencer
// Default displayed pad

interface NotePadProps {
  bold?: boolean;
  italic?: boolean;
  activeChildIdx?: number;
  keys: any[];
  onHold?: Function;
  onRelease?: Function;
  onClick?: Function;
  action?: string;
};

const NotesPad: React.FC<NotePadProps> = (props) => {
  const { startNote } = React.useContext(playerContext);
  const [keys] = React.useState(generateKeys(+startNote[1]).map((v, idx) => ({...v, idx })));
  return (
    <Pad bold={props.bold} italic={props.italic} activeChildIdx={props.activeChildIdx}> 
      { keys.map((note) => (
          <Note
            key={note.id}
            {...note}
            onHold={props.onHold}
            onRelease={props.onRelease}
            onClick={props.onClick}
            action={props.onClick ? props.action : undefined}
          />
        ))
      }
    </Pad>
  )
};

export default NotesPad;
