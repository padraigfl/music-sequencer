import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import playerContext from '../Core/context';
import { PATTERN_IDX, PATTERN_CHAIN, SOUND, WRITE, BPM, VOLUME } from '../Core/_constants';

const border = '1px dotted black';

const DataViews = styled('div')`
  grid-column: 3/7;
  grid-row: 1/4;
  background-color: #aabbaa;
  font-family: monospace;
  user-select: none;
  pointer-event: none;
  display: grid;
  grid-template-rows: repeat(6, ${100/6}%);
  grid-template-columns: repeat(8, 12.5%); 
  align-items: center;

  padding: 2px;
`;

const PatternData = styled('div')`
  grid-row: 2/5;
  padding: 2px;
  text-align: center;
  align-self: start;
  height: 100%;
  outline: ${border};
  overflow: hidden;
`;

const GridCell = styled('div')`
  text-align: center;

  ${({ column, width = 1 }) => typeof column !== 'undefined'
    ? `grid-column: ${column}/${column + width};`
    : ''
  }
  ${({ row, height = 1 }) => typeof row !== 'undefined'
    ? `grid-row: ${row}/${row + height};`
    : ''
  }
  &::after {
    content: attr(data-display);
  }
  ${ ({ borderRight }) => borderRight ? 'border-right: 1px dotted black;' : ''}
  ${({ align }) => align ? `align-self: ${align};` : ''}
`;

const IOSAlert = styled('div')`
  grid-column: 2/9;
  text-align: right;
  align-self: start;
  &::after {
    ${({ lastAction }) => {
      if (!lastAction) {
        return 'content: \'Press unmute to begin\';';
      }
      if (/iPhone|iPod|iPad/.test(navigator.platform)) {
        return 'content: \'iOS needs silent off\';';
      }
      return '';
    }}
  }
`

const getView = state => {
  if (state.view) {
    return state.view;
  }
  if (state[WRITE]) {
    return 'compose';
  }
  return 'soundcheck';
}

const LogView = styled('ul')`
  grid-row: 2/6;
  grid-column: 2/9;
  border: 1px dotted black;
  padding-left: 20px;
  margin: 5px;
  line-height: 10px;
  height: 100%;
`;

const actionListLimit = 7;

const DataView = (props) => {
  const { state } = useContext(playerContext);
  const [log, setLog] = useState([]);
  useEffect(() => {
    if (props.viewLog) {
      return;
    }
    if (!state.lastAction) {
      return;
    }
    if (log.length < actionListLimit) {
      setLog([...log, state.lastAction]);
      return;
    }
    setLog([...log.slice(log.length - actionListLimit + 1), state.lastAction])
  }, [state.lastAction]);
  const { sound, ...rest} = state;
  return (
    <DataViews>
      <GridCell data-display={state[PATTERN_IDX].toString().padStart(2, '0')} />
      <PatternData>
        {state[PATTERN_CHAIN].map(v => v.toString().padStart(2, '0')).join(' ')}
        {' ^^'}
      </PatternData>
      <GridCell row={6} column={1} data-display={state[BPM].toString().padStart(3, '0')} />
      <GridCell row={5} column={1} data-display={'S00'} align="end" />
      {!props.viewLog && log.length ? (
        <LogView>
          {log.map((v, idx) => <li key={v+idx+'log'}>{v}</li>)}
        </LogView>
      ) : null}
      <GridCell row={6} column={2} width={6} data-display={getView(state)} />
      <GridCell row={5} column={8} data-display={`${Math.floor(state[VOLUME] + 8)}`.padStart(2, '0')} />
      <GridCell row={6} column={8} data-display={state[SOUND].toString().padStart(2, '0')} />
      { <IOSAlert lastAction={state.lastAction} />}
    </DataViews>
  );
}

export default DataView;