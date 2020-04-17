import styled from 'styled-components';

const margin = 10;

const Pad = styled('div')`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 320px;
  grid-column: 1/5;
  grid-row: 4 / 9;
  > button {
    margin: ${margin}px;
    width: calc(25% - ${margin * 2}px);
    height: calc(${({ entries = 16 }) => (100 / (entries / 4))}% - ${margin * 2}px);
  }
`;

export default Pad;
