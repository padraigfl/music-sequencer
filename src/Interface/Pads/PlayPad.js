import React, {
  useState,
  useEffect,
} from 'react';
import Note from '../Cells/Note';
import { generateKeys } from '../_utils';
import Pad from './abstractPad';

const PlayPad = (props) => {
  const [keys, setKeys] = useState(generateKeys(props.octave));

  useEffect(() => {
    setKeys(generateKeys(props.octave));
  }, [props.octave]);

  return (
    <Pad style={{ flexWrap: 'wrap-reverse' }}> 
      { keys.map(note => <Note key={note.id} {...note} />) }
    </Pad>
  )
};

export default PlayPad;
