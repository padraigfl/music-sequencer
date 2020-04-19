import React, { useContext } from 'react';
import styled from 'styled-components';
import playerContext from '../System/context';
import { PATTERN_IDX, PATTERN_CHAIN, PATTERNS, PLAY, WRITE, BPM } from '../System/_utils';

const DataViews = styled('div')`
  grid-column: 1/4;
  grid-row: 1/3;
  background-color: #aabbaa;
  margin: 4px;
  font-family: monospace;
  .play, .write {
    display: inline-block;
    margin: 2px 4px;
    opacity: 0.5;
    &.active {
      opacity: 1;
      text-shadow: 1px 1px lightgrey;
    }
  }
`;

const DataView = () => {
  const { state } = useContext(playerContext);
  const { sound, ...rest} = state;
  const bools = Object.entries(rest).filter(([_, val]) => typeof val === 'boolean');
  return (
    <DataViews>
      <div className={`play ${state[PLAY] ? 'active' : ''}`}>▶️</div>
      <div className={`write ${state[WRITE] ? 'active' : ''}`}>⏺️</div>
      <div className={`bpm`}>{state[BPM]}</div>
      <div className={`pattern`} />
      {state[PATTERN_IDX]} <br/>
      {state[PATTERN_CHAIN].join(',')}
      <p>{state[PATTERNS][state[PATTERN_IDX]].spots.map(v => (v ? v.note + '-' + (v.span||'') : '_')).join(',')}</p>
    </DataViews>
  );
}

export default DataView;