import React, {
  useCallback,
  useContext,
  useReducer,
  useMemo,
} from 'react';
import playerContext from '../System/Tone';
import Action from './Cells/Action';
import DragGrid from './DragMeters/DragGrid';
import { WRITE, SOUNDS_VIEW, PATTERN, BPM, PLAY } from '../System/_utils';

const Actions = () => {
  const {
    state,
    dispatch,
  } = useContext(playerContext);

  const fireDispatch = useCallback(
    (e) => {
      const dataset = e.currentTarget.dataset;
      console.log('dispatch', dataset)
      if (dataset.type) {
        dispatch(dataset);
      }
    },
    [],
  );

  const actions = [
    { id: WRITE, isActive: state[WRITE] },
    { id: PLAY, isActive: state[PLAY], activeChildren: 'pause' },
    { id: SOUNDS_VIEW, onHold: { type: 'nah', action: () => {}} },
    { id: PATTERN, isActive: state.isPatternMode,
      drag: {
        Component: DragGrid,
        props: {
          onRelease: () => {},
          rows: 5,
          cols: 5,
          cells: new Array(25).fill({}).map((v, idx) => ({ id: idx })),
        }
      }
    },
    { id: BPM, onHold: { type: 'bpm', action: () => {} }},
    { id: 'fx' },
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
