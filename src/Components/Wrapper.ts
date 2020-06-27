import styled from 'styled-components';

export const playerWidth = 450;
export const columns = 8;
export const rows = 11;
export const maxHeight = (450 / columns) * rows;

export const wrapperStyles = `
  max-width: ${playerWidth}px;
  width: 100%;
  margin: auto;
  max-height: -webkit-fill-available;
  touch-action: none;
  @media only screen and (min-width: ${playerWidth}px) {
    height: ${maxHeight}px;
  }
`

const Wrapper = styled('div')`
  ${wrapperStyles}
  ${({ colorFilter }: { colorFilter?: string }) => (
    colorFilter ? `filter: ${colorFilter};` : ''
  )}
  ${({ extraStyles }) => extraStyles ? extraStyles : ''}
`;

export default Wrapper;
