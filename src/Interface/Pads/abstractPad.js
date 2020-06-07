import styled from 'styled-components';
import { playerWidth, columns } from '../../Player';

const margin = 8;
const pw = 450;
const col = 8;

const Pad = styled('div')`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100vw;
  max-height: ${pw}px;
  grid-column: 1 / ${col + 1};
  grid-row: 4 / 5;
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
