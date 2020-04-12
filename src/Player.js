import React, {
  useCallback,
  useContext,
  useState,
} from 'react';
import styled from 'styled-components';
import Actions from './Interface/Actions';
import PlayPad from './Interface/Pads/PlayPad';
import SequencePad from './Interface/Pads/SequencePad';
import playerContext from './System/Tone';

const Wrapper = styled('div')`
  display: grid;
  max-width: 320px;
  max-height: 100vh;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 80px;
`;
const DataView = styled('div')`
  grid-column: 1/4
`;

const action = (text, values) => e => {
  if (e && e.nativeEvent && e.nativeEvent.changedTouches && e.nativeEvent.changedTouches[0]) {
    console.log(
      text,
      e.nativeEvent.changedTouches[0].clientX,
      e.nativeEvent.changedTouches[0].clientY,
    );
  } else if (e && e.nativeEvent && e.nativeEvent.buttons === 1){
    console.log(text, e.nativeEvent.clientX, e.nativeEvent.clientY);
  } else if (text !== 'MouseMove') {
      console.log(
        text,
        e && Object.entries(e).reduce((acc, v) => v[1] ? ({
        ...acc,
        [v[0]]: v[1]
      }) : acc, {}));
  } else {
    console.log(text, e);
  }
};

const UI = () => {
  return (
    <Wrapper>
      <DataView />
      <Actions />
      <PlayPad />
      <SequencePad />
    </Wrapper>
  )
}

export default UI;
