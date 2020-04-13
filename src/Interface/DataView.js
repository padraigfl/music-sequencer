import React, { useContext } from 'react';
import styled from 'styled-components';
import playerContext from '../System/Tone';

const DataViews = styled('div')`
  grid-column: 1/4;
  grid-row: 1/3;

`;

const DataView = () => {
  const { state } = useContext(playerContext);
  const { sound, ...rest} = state;
  console.log(sound);
  return (
    <DataViews>
      {JSON.stringify(rest).split(',').join(' ')}
    </DataViews>
  );
}

export default DataView;