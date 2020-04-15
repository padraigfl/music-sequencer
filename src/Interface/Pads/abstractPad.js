import styled from 'styled-components';

const Pad = styled('div')`
  position: relative;
  display: flex;
  width: 100%;
  height: 320px;
  flex-wrap: wrap;
  grid-column: 1/5;
  grid-row: 4 / 9;
  > button {
    width: calc(25% - 8px);
    height: calc(${({ entries = 16 }) => (100 / (entries / 4))}% - 8px);
  }
`;

export default Pad;
