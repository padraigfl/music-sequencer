import React, {
  useCallback,
  useContext,
  useMemo,
} from 'react';
import playerContext from '../System/context';
import Action from './Cells/Action';

import {
  PLAY,
  WRITE,
  BPM,
  SOUND,
  VOLUME,
  SOUNDS_VIEW,
  PATTERN_VIEW,
  PATTERN_CHAIN,
  CANCEL,
} from '../System/_constants';

const actionButtons = [
  { id: CANCEL },
  { id: WRITE, isActive: WRITE },
  { id: SOUNDS_VIEW, value: SOUND, secondaryAction: VOLUME },
  { id: PATTERN_VIEW, secondaryAction: PATTERN_CHAIN },
  { id: BPM, value: BPM },
  { id: PLAY, isActive: PLAY, activeChildren: 'pause' },
];

const getActionButtons = (state) => actionButtons.map(
  button => ({
    ...button,
    isActive: state[button.isActive],
    value: state[button.value], 
  })
);

const Actions = () => {
  const {
    state,
    dispatch,
  } = useContext(playerContext);

  const fireDispatch = useCallback(
    (e) => {
      const dataset = e.currentTarget.dataset;
      if (dataset.action) {
        dispatch({ type: dataset.action});
      }
    },
    [],
  );

  const actions = useMemo(() => getActionButtons(state), [state]);

  return (
    <>
      {actions.map(action => (
        <Action
          {...action} 
          key={action.id}
          onClick={fireDispatch}
          isActive={action.isActive || state.view === action.id}
        />
      ))}
    </>
  );
}

export default Actions;
