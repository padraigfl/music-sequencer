import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import Actions from './Actions';
import PlayPad from './Pads/NotesPad';
import SequencePad from './Pads/SequencePad';
import DataView from './DataView';
import SoundsPad from './Pads/SoundsPad';
import StatusPad from './Pads/StatusPad';
import PatternsPad from './Pads/PatternsPad';
import playerContext from '../Core/context';
import { PATTERN_VIEW, SOUNDS_VIEW, WRITE } from '../Core/_constants';
import { DesktopEventsProvider } from './DesktopEventsContext';


export const playerWidth = 450;
export const columns = 8;
export const rows = 11;
export const maxHeight = (450 / columns) * rows;

const Wrapper = styled('div')`
  display: grid;
  max-width: ${playerWidth}px;
  width: 100%;
  max-height: -webkit-fill-available;
  grid-template-columns: repeat(${columns}, ${100/columns}%);
  grid-template-rows: repeat(3, ${100 / columns}vw) auto;
  touch-action: none;
  @media only screen and (min-width: ${playerWidth}px) {
    height: ${maxHeight}px;
    grid-template-rows: repeat(3, ${100 / rows}%) auto;
  }
  ${({ colorFilter }) => colorFilter ? `filter: ${colorFilter};` : ''}
`;


const PadsRender = () => {
  const { state } = useContext(playerContext);

  return useMemo(() => {
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
    <Wrapper colorFilter={props.colorFilter}>
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
