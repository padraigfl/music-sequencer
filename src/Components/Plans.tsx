import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const BoringWrapper = styled.div`
  padding: 16px;
  max-width: 600px;
  margin: auto;
  color: #ddd;
  background-color: #555;
  text-shadow: 0px 0px 8px black;
  h1 {
    border-bottom: 2px solid #ccc;
  }
  h2, h3 {
    border-bottom: 1px solid #ccc;
  }
  a { color: #ddd; }
`;

const Plans: React.FC<{}> = props => (
  <BoringWrapper>
    <Link to="/">Home</Link>
    <h1>To be implemented...</h1>
    <p>Sorry, this section is being left until the other bits actually work okay.</p>
    <h2>What exactly is this section though?</h2>
    <p>The idea is that if you're able to make some sequences and chain them on each player, then you'd be able to play them simultaneously and switch between them</p>
    <p>If this works okay technically then what I'd <em>really</em> like to do is add a server so multiple devices could sync together, this would allow one person to play with multiple phones at once just like when using multiple pocket operators or to play together either with friends via the same link or some kind of Chatroulette style setup.</p>
    <h2>Okay... so any idea when you might actually do this?</h2>
    <p>Firstly I'd like to get the UI to be a bit more clear, it'd also be nice to get some help with the sounds and stuff cos I'm a total novice when it actually comes to that stuff (I just really like messing with TE gadgets)</p>
    <p>I'm pretty sure it'd be quite easy to sync by just nesting the inactive players within the main one and playing them all</p>
    <h2>Can I help?</h2>
    <p>Absolutely yes!</p>
    <ul>
      <li>It'd be amazing if someone could get better options for the 16 instruments on each player and give me an idea of how to do a more advanced drum machine style variant (what kind of optiosn could fit within the constraints of the UI)</li>
      <li>Getting volumes all balanced out so each instrument is at a similar level of loudness would be cool too</li>
      <li>Any ways of improving how browsers handle the audio, especially with iOS</li>
      <li>Fix the issues with the Patterns button on Android</li>
      <li>How to structure the tutorial(s), what's there right now is very rudimentary</li>
      <li>If someone made a page with images to reference and stuff, along with improvements to the UI via icons</li>
      <li>Ideas for what to do with the green/grey bit at the top, how could it best convey the relevant info at a given time</li>
    </ul>
  </BoringWrapper>
);

export default Plans;
