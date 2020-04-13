import React, { useContext } from 'react';
import styled from 'styled-components';
import playerContext from '../System/Tone';

const DataViews = styled('div')`
  grid-column: 1/4;
  grid-row: 1/3;
  background-color: #aabbaa;
  margin: 4px;
`;

const DataView = () => {
  const { state } = useContext(playerContext);
  const { sound, ...rest} = state;
  const bools = Object.entries(rest).filter(([_, val]) => typeof val === 'boolean');
  return (
    <DataViews>
      {JSON.stringify(rest).split(',').join(' ')}
      { bools.map(([key, val]) => <div className={`${key} ${val ? `${key}--active` : ''}`} />)}
    </DataViews>
  );
}

export default DataView;