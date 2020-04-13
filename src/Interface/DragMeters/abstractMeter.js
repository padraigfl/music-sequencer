import React from 'react';
import styled from 'styled-components';

const Cancel = styled('div')`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
  z-index: 5;
`;

const Wrapper = styled('div')`
  width: 320px;
  height: 320px;
  top: ${({ pad }) => pad ? 0 : '160px'};
  position: absolute;
`;

const MeterWrapper = (props) => {
  return (
    <Wrapper pad={props.pad}>
      <Cancel
        eUp={props.onCancel}
        onTouchEnd={props.onCancel}
        onClick={props.onCancel}
      />
      {props.children}
    </Wrapper>
  );
};

export default MeterWrapper;
