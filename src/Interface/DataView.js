import React, { useContext } from 'react';
import styled from 'styled-components';
import playerContext from '../System/Tone';
import { PATTERN_IDX, PATTERN_CHAIN, PATTERNS, PLAY, WRITE } from '../System/_utils';

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
      {state[PLAY] ? 'P' : '[]'} |  {state[WRITE] ? 'O' : '[]'} | {state[PATTERN_IDX]} <br/>
      {state[PATTERN_CHAIN].join(',')}
      <p>{state[PATTERNS][state[PATTERN_IDX]].spots.map(v => (v ? v.note + '-' + (v.span||'') : '_')).join(',')}</p>
    </DataViews>
  );
}

export default DataView;