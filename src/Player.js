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

const Wrapper = styled('div')`
  display: grid;
  max-width: 320px;
  max-height: 100vh;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(3, 40px) 320px 1fr;
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
