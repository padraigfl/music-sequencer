import * as React from 'react';
import { NavLink, useLocation, useHistory, useParams } from 'react-router-dom';
import Wrapper from './Wrapper';
import styled from 'styled-components';

const NavAction = styled(NavLink)`
  position: relative;
  display: block;
  text-align: center;
  text-transform: uppercase;
  padding: 20px;
  margin: auto;
  color: white;
  text-decoration: none;
  &:before {
    position: absolute;
    height: 100vh;
    bottom: 0px;
    left: 0px;
    background-color: white;
    opacity: 0.05;
    width: 100%;
    content: '';
    pointer-events: none;
  } 
`

const Menu: React.FC<{}> = () => {
  const location = useLocation();
  const history = useHistory();
  const { player = 'melody' } = useParams();

  if (location.pathname === '/' && location.search.match(/\?tutorial/)) {
    history.replace('/solo/melody/tutorial');
    return null;
  }

  return (
    <Wrapper>
      <NavAction to="/solo/melody/normal">Melody Solo</NavAction>
      <NavAction to="/solo/bass/normal">Bass Solo</NavAction>
      <NavAction to="/simultaneous">Simultaneous</NavAction>
      <NavAction to={`/solo/${player}/tutorial`}>Help</NavAction>
    </Wrapper>
  );
};

export default Menu;
