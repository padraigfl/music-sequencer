import React, {
  useCallback,
  useContext,
  useReducer,
  useMemo,
} from 'react';
import playerContext from '../System/context';
import Action from './Cells/Action';
import DragGrid from './DragMeters/DragGrid';
import { CANCEL, WRITE, SOUNDS_VIEW, BPM, PLAY, PATTERN_VIEW, SOUND } from '../System/_utils';

const Actions = () => {
  const {
    state,
    dispatch,
  } = useContext(playerContext);

  const fireDispatch = useCallback(
    (e) => {
      const dataset = e.currentTarget.dataset;
      if (dataset.type) {
        dispatch(dataset);
      }
    },
    [],
  );

  const actions = [
    { id: CANCEL },
    { id: WRITE, isActive: state[WRITE] },
    { id: SOUNDS_VIEW, value: state[SOUND] },
    { id: PATTERN_VIEW },
    { id: BPM, value: state[BPM]},
    { id: PLAY, isActive: state[PLAY], activeChildren: 'pause' },
  ];

  return (
    <>
      {actions.map(action => (
        <Action {...action}  key={action.id} onClick={fireDispatch} isActive={action.isActive || state.view === action.id} />
      ))}
    </>
  );
}

export default Actions;
