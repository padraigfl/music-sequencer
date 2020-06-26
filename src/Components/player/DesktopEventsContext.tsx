import * as React from 'react';
import playerContext from '../../Core/context';
import { CANCEL, MULTI_TOUCH, PATTERN_CHAIN, PATTERN_COPY, SWING_SET, CLEAR_TEMP, NOTE_COPY, PLAY, VOLUME } from '../../Core/_constants';

const desktopEventsContext = React.createContext({});

interface HeldState {
  action?: string;
  secondary?: string;
  value?: string;
};

// as this is primarily a mobile touch screen, multitouch actions are React.used a lot
// this is an attempt to push all the mouse handling nonsense into one spot and convert it to match
export const DesktopEventsProvider = (props) => {
  const [held, setHeld]: [HeldState, React.Dispatch<React.SetStateAction<HeldState>>] = React.useState({});
  const { dispatch, state } = React.useContext(props.context);

  React.useEffect(() => {
    if (
      held.secondary
      && [
        CANCEL,
        VOLUME,
        PATTERN_COPY,
        SWING_SET,
        NOTE_COPY,
        CLEAR_TEMP,
        PLAY,
      ].includes(state.lastAction)
    ) {
      setHeld({});
      dispatch({ type: 'hold_action_complete' });
    }
  }, [held, state.lastAction]);

  const holdAction = React.useCallback((dataset) => {
    const basicActionButton = Object.keys(dataset).length === 1 && dataset.action;

    if (basicActionButton) {
      dispatch({ type: basicActionButton });
    }

    if (
      held.action === dataset.action
      && held.value === dataset.value
      || basicActionButton
    ) {
      dispatch({
        type: CLEAR_TEMP,
        values: held,
      });
    } else if (held.action) {
      console.log({
        type: MULTI_TOUCH,
        value: [
          held,
          dataset,
        ],
      })
      dispatch({
        type: MULTI_TOUCH,
        value: [
          held,
          dataset,
        ],
      });
    }
  }, [held]);

  const onHold = React.useCallback((dataset) => {
    if (
      dataset.secondary
      && dataset.secondary !== held.secondary
    ) {
      setHeld(dataset);
      if ([PATTERN_CHAIN].includes(dataset.secondary)) {
        dispatch({
          type: MULTI_TOUCH,
          value: [dataset],
        });
      }
    } else {
      setHeld({});
    }
  }, [held]);

  return (
    <desktopEventsContext.Provider
      value={
        {
          held: held,
          holdAction,
          onHold,
        }
      }
    >
      {props.children}
    </desktopEventsContext.Provider>
  );
};

DesktopEventsProvider.defaultProps = {
  context: playerContext,
};

export default desktopEventsContext;
