import * as React from 'react';
import playerContext from '../../Core/context';
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
  MUTE,
} from '../../Core/_constants';

const actionButtons = [
  { id: PATTERN_VIEW, secondaryAction: PATTERN_CHAIN, height: 2, width: 2, display: 'Patterns' },
  { id: 'menu', icon: '/static/icons/menu.png' },
  { id: CANCEL, display: 'C' },
  { id: MUTE, isActive: MUTE, secondaryAction: VOLUME, icon: '/static/icons/mute.png' },
  { id: WRITE, isActive: WRITE, icon: '/static/icons/record.png' },
  { id: BPM, value: BPM, width: 2 }, // secondary = swing?
  { id: SOUNDS_VIEW, value: SOUND, display: 'S' },
  { id: PLAY, isActive: PLAY, icon: '/static/icons/play.png' },
];

const Actions: React.FC<{}> = () => {
  const {
    state,
    dispatch,
  } = React.useContext(playerContext);

  const fireDispatch = React.useCallback(
    (e) => {
      const dataset = e.currentTarget.dataset;
      if (dataset.action) {
        dispatch({ type: dataset.action });
      }
    },
    [],
  );

  return (
    <>
      {actionButtons.map((action) =>
        React.useMemo(() => (
          <Action
            {...action}
            key={action.id}
            onClick={fireDispatch}
            isActive={state[action.isActive] || state.view === action.id}
            display={`${action.display || action.id}${state[action.value] || ''}`}
          />
        ), [state[action.isActive], state.view, state[action.value]])
      )}
    </>
  );
}

export default Actions;
