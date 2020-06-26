import * as React from 'react';
import Cell from './abstractCell';
import { Pattern } from '../../../Core/_types';

const getDisplay = (pattern: Pattern): (string | void) => {
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

type PatternCellProps = {
  onClick: Function;
  pattern: Pattern;
  secondaryAction: string;
  action: string;
  isActive?: boolean;
  value: any;
  idx: any;
};

const PatternCell: React.FC<PatternCellProps> = ({ pattern, ...props}) => {
  return (
    <Cell {...props} display={getDisplay(pattern) || undefined} isDataDisplay/>
  );
};

export default PatternCell;
