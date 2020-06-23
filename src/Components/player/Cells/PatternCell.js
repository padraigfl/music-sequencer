import React from 'react';
import styled from 'styled-components';
import Cell from './abstractCell';
import Pad from '../Pads/abstractPad';

const gridBg = (vals) => `
  background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent);`


// const iterator = new Array(16).fill(null);

// const Spot = styled('span')`
//   border-radius: 2px;
//   border: 1px dashed #eee;
//   ${props => {
//     if (props.beat) {
//       return `background-color: blue;`;
//     }
//     if (props.spot) {
//       return `background-color: red;`;
//     }
//     return `background-color: transparent;`;
//   }}
// `;

// const PatternView = styled('span')`
//   display: grid;
//   grid-gap: 1%;
//   width: 100%;
//   height: 100%;
//   grid: repeat(4, 24%) / repeat(4, 24%);
//   border-radius: 4px;
//   user-select: none;
//   pointer-event: none;
// `

const getDisplay = pattern => {
  const noteCount = pattern.spots.filter(v => v).length;
  const beatCount = pattern.drums.filter(v => v).length;
  if (!noteCount && !beatCount){
    return
  }
  return pattern.spots.map((v, idx) => 
    `${
      v ? v.note : '__'
    }${
      pattern.drums[idx] ? 'X' : '_'
    }${idx !== 15 && idx % 4 === 3 ? ' ': ''
  }`).join('');
}

const PatternCell = ({ pattern, ...props}) => {
  return (
    <Cell {...props} display={getDisplay(pattern)} isDataDisplay/>
    //   <PatternView display={`${pattern}`}>
    //     {iterator.map((_, idx) => (
    //       <Spot beat={pattern.drums[idx]} spot={pattern.spots[idx]} /> 
    //     ))}
    //   </PatternView>
    // </Cell>
  );
};

export default PatternCell;
