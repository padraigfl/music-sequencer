import React, {
  useCallback,
  useContext,
  useMemo,
} from 'react';
import playerContext from '../System/context';
import Action from './Cells/Action';
import { getActionButtons, CANCEL } from '../System/_utils';

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

  const onHold = useCallback((val) => {
    dispatch({
      type: val,
    });
  }, []);

  const onCancelHold = useCallback((val) => {
    dispatch({ type: CANCEL });
  }, []);

  const actions = useMemo(() => getActionButtons(state), [state]);

  return (
    <>
      {actions.map(action => (
        <Action
          {...action} 
          key={action.id}
          onHold={onHold}
          onCancelHold={onCancelHold}
          onClick={fireDispatch}
          isActive={action.isActive || state.view === action.id}
        />
      ))}
    </>
  );
}

export default Actions;
