import styled from 'styled-components';

const margin = 10;

const Pad = styled('div')`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 320px;
  height: 320px;
  grid-column: 1/5;
  grid-row: 4 / 9;
  justify-content: space-evenly;
  > button {
    border-radius: 4px;
    box-shadow: 0px 0px 0px 1px #222, 0px 0px 0px 3px rgba(255, 255, 255, 0.5), 0px 0px 0px 5px rgba(255, 0, 0, 0.2);
    margin: ${margin}px;
    width: calc(25% - ${margin * 2}px);
    height: calc(${({ entries = 16 }) => (100 / (entries / 4))}% - ${margin * 2}px);
    border: none;
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
