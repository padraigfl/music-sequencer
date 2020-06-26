import * as React from 'react';
import styled from 'styled-components';

const margin = 8;
const playerWidth = 450;
const columns = 8;

const padActiveTransparent = 'radial-gradient(#efaaaa 40%, rgba(255, 255, 255, 0.7) 75%)';

// buttons located in the pad need some translucency to allow fiddling with the StatusPad colors underneath
// pretty hacky but I think it opens up some design freedom that can be totally divorced from reach
// and that's kinda neat???
const Pad: React.FC<any> = styled('div')`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100vw;
  max-height: ${playerWidth}px;
  grid-column: 1 / ${columns + 1};
  grid-row: 4 / 5;
  justify-content: space-evenly;
  > button, > .cell {
    border-radius: 4px;
    margin: ${margin}px;
    width: calc(25% - ${margin * 2}px);
    height: calc(${({ entries = 16 }) => (100 / (entries / 4))}% - ${margin * 2}px);
  }
  > button {
    background-color: rgba(255, 255, 255, 0.7);  
  }
  > button:active {
    padding-top: 1px;
    padding-left: 1px;
  }
  > button[data-active] {
    background: ${padActiveTransparent} !important;
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
  ${({ bold }) => bold ? ` *::after { font-weight: bold }` : ''}
  ${({ italic }) => italic ? ` *::after { font-style: italic; }` : ''}
  ${({ activeChildIdx }) => typeof activeChildIdx === 'number'
    ? `>*:nth-child(${activeChildIdx + 1}) { box-shadow: inset 0px 0px 4px 2px blue; } `
    : ''
  }
`;

const AbstractPad = ({ children, ...props }) => (
  <Pad {...props} className={`Pad ${props.className || ''}`}>
    { React.Children.map(children, (child, idx) => (
      React.useMemo(() => (
        React.cloneElement(child, { idx })
      ), [props])
    ))}
  </Pad>
);

export default AbstractPad;
