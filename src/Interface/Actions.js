import React, {
  useCallback,
  useContext,
  useReducer,
  useMemo,
} from 'react';
import playerContext from '../System/Tone';
import Action from './Cells/Action';
import XYGrid from './DragMeters/XYGrid';

const PLAY = 'play';
const WRITE = 'write';
const PATTERN = 'pattern';
const BPM = 'bpm';
const VOLUME = 'volume';
const SOUND = 'sound';

const Actions = () => {
  const {
    state,
    dispatch,
  } = useContext(playerContext);

  const fireDispatch = useCallback(
    (e) => {
      const dataset = e.target.dataset;
      console.log('dispatch', dataset)
      if (dataset.type) {
        dispatch(dataset);
      }
    },
    [],
  );

  const actions = [
    { id: WRITE, isActive: state[WRITE] },
    { id: SOUND, onHold: { type: 'nah', action: () => {}} },
    { id: PATTERN, isActive: state.isPatternMode,
      drag: {
        Component: XYGrid,
        props: {
          onRelease: () => {},
          rows: 4,
          cols: 4,
        }
      }
    },
    { id: BPM, onHold: { type: 'bpm', action: () => {} }},
    { id: PLAY, isActive: state[PLAY], activeChildren: 'pause' }
  ];

  return (
    <>
      {actions.map(action => (
        <Action key={action.id} onClick={fireDispatch} {...action} />
      ))}
    </>
  );
}

export default Actions;
