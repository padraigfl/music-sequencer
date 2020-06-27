import * as React from 'react';
import { NavLink, useLocation, useHistory, useParams } from 'react-router-dom';
import Wrapper from './Wrapper';
import * as styled from 'styled-components';

const NavAction = styled.default(NavLink)`
  position: relative;
  text-align: center;
  text-transform: uppercase;
  padding: 20px 0px;
  margin: auto;
  color: white;
  text-decoration: none;
  width: 100%;
  &:before {
    position: absolute;
    height: 100vh;
    bottom: 0px;
    left: 0px;
    background-color: white;
    opacity: 0.05;
    width: 100%;
    content: '';
    z-index: -10;
  } 
`
const Contents = styled.default.div`
  display: flex;
  flex-direction: column;
  color: #eee;
  h1 {
    border-bottom: 1px solid grey;
    margin: 0px;
    width: 100%;
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
      <Contents>
        <h1>16step</h1>
        <NavAction to="/about">About</NavAction>
        <NavAction to="/solo/melody/normal">Melody Solo</NavAction>
        <NavAction to="/solo/bass/normal">Bass Solo</NavAction>
        <NavAction to="/simultaneous">Simultaneous</NavAction>
        <NavAction to={`/solo/${player}/tutorial`}>Help</NavAction>
      </Contents>
    </Wrapper>
  );
};

export default Menu;
