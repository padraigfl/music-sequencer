import React, { useContext } from 'react';
import styled from 'styled-components';
import Actions from './Interface/Actions';
import PlayPad from './Interface/Pads/NotesPad';
import SequencePad from './Interface/Pads/SequencePad';
import DataView from './Interface/DataView';
import SoundsPad from './Interface/Pads/SoundsPad';
import StatusPad from './Interface/Pads/StatusPad';
import PatternsPad from './Interface/Pads/PatternsPad';
import playerContext from './System/context';
import { PATTERN_VIEW, SOUNDS_VIEW, WRITE } from './System/_constants';
import { DesktopEventsProvider } from './Interface/DesktopEventsContext';


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
`;


const PadsRender = () => {
  const { state } = useContext(playerContext);

  if (state.view === SOUNDS_VIEW) {
    return <SoundsPad />;
  }
  if (state.view === PATTERN_VIEW) {
    return <PatternsPad />
  }
  if (state[WRITE]) {
    return <SequencePad />;
  }

  return <PlayPad />;
};

const UI = () => {
  return (
    <Wrapper>
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
