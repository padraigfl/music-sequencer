import * as React from 'react';
import Actions from './Actions';
import Wrapper, { playerWidth } from '../Wrapper';
import PlayPad from './Pads/NotesPad';
import SequencePad from './Pads/SequencePad';
import DataView from './DataView';
import SoundsPad from './Pads/SoundsPad';
import StatusPad from './Pads/StatusPad';
import PatternsPad from './Pads/PatternsPad';
import playerContext from '../../Core/context';
import { PATTERN_VIEW, SOUNDS_VIEW, WRITE } from '../../Core/_constants';
import { DesktopEventsProvider } from './DesktopEventsContext';
import { css } from 'styled-components';

export const columns = 8;
export const rows = 11;
export const maxHeight = (450 / columns) * rows;

const gridStyles = css`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${columns}, ${100/columns}%);
  grid-template-rows: repeat(3, ${100 / columns}vw) auto;
  touch-action: none;
  @media only screen and (min-width: ${playerWidth}px) {
    grid-template-rows: repeat(3, ${100 / rows}%) auto;
  }
`;

const PadsRender = () => {
  const { state } = React.useContext(playerContext);

  return React.useMemo(() => {
    if (state.view === SOUNDS_VIEW) {
      return <SoundsPad />;
    }
    if (state.view === PATTERN_VIEW) {
      return <PatternsPad />
    }
    if (state.view === WRITE || state[WRITE]) {
      return <SequencePad />;
    }
  
    return <PlayPad />;
  }, [state.view, state[WRITE]]);
};

const UI = (props) => {
  return (
    <Wrapper extraStyles={gridStyles} colorFilter={[props.colorFilter]}>
      <DataView />
      <DesktopEventsProvider>
        <StatusPad />
        <Actions />
        <PadsRender />
      </DesktopEventsProvider>
    </Wrapper>
  )
}

export default UI;
