import React, { useMemo } from 'react';
import styled from 'styled-components';

const margin = 12;

const Pad = styled('div')`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 320px;
  height: 320px;
  grid-column: 1/5;
  grid-row: 4 / 9;
  justify-content: space-evenly;
  > button, > .cell {
    border-radius: 4px;
    margin: ${margin}px;
    width: calc(25% - ${margin * 2}px);
    height: calc(${({ entries = 16 }) => (100 / (entries / 4))}% - ${margin * 2}px);
  }
  > button {
    background-color: rgba(255, 255, 255, 0.9);
  }
  > button:active {
    padding-top: 1px;
    padding-left: 1px;
  }
  > buttons {
    border-bottom: 2px solid #bbb;
    border-right: 2px solid #bbb;
    &:active {
      border: none;
      border-top: 1px solid #222;
      border-left: 1px solid #222;
    }
  }
`;

export default Pad;
