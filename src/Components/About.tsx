import * as React from 'react';
import { Link } from 'react-router-dom';
import { BoringWrapper } from './Plans';

const About: React.FC<{}> = () => (
  <BoringWrapper>
    <Link to="/">Home</Link>
    <h1 id="music-app-thing">Music App Thing</h1>
    <p>(Designed primarily with mobiles in mind)</p>
    <h2 id="what-this-does-">What this does?</h2>
    <p>Originally I was just going to do a straight up replica of a Teenage Engineering Pocket Operator, but as I was using it very early on I realised it&#39;d be way more fun to make something based on that kind of premise but designed to work on a mobile phone. </p>
    <ul>
      <li>16 step sequencer</li>
      <li>16 instrument options</li>
      <li>Save 16 sixteen step patterns</li>
      <li>Which you can then chain in whatever order you like</li>
      <li>(On the existing players) each pattern contains two parts, the melody (played with a selected instrument from options 1-15) and a simple beat (using instrument 16).</li>
    </ul>
    <p>There&#39;s a largely redundant space at the top of the screen that will be used to more clearly convey what&#39;s going on when I know which bits are most confusing.</p>
    <p>It may be beneficial to watch some videos of pocket operators first to get an idea of what this would love to be.</p>
    <h2 id="how-it-works">How it works</h2>
    <p><a href="https://padraig-operator.netlify.app/solo/melody/tutorial">https://padraig-operator.netlify.app/solo/melody/tutorial</a> will hopefully explain some of it, it&#39;s quite buggy right now unfortunately.</p>
    <p>As it was primarily designed with phones in mind, I designed everything with two point multitouch in mind. The solutions for desktop involve holding down the first value of a multitouch and then selecting the second after it turns blue.</p>
    <p>The order in which buttons is pressed is important, but I&#39;ll hopefully resolve this later.</p>
    <h3 id="buttons">Buttons</h3>
    <p>Click actions:</p>
    <ul>
      <li>BPM: toggles the bmp between a series of options</li>
      <li>Menu: Goes to home page</li>
      <li>C: cancel button, unfinished but basically a catch all (I wanna get out of this)</li>
      <li>Speaker: Mute/Unmute</li>
      <li>Record: Enter write mode</li>
      <li>S: Select sound to use</li>
      <li>Play: play pause</li>
      <li>Pattern: select pattern to edit (may require to be held on android for the moment)</li>
      <li>buttons 1-16: varies on mode (select note/duration/pattern/spot/sound/..., default is play note)</li>
    </ul>
    <p>MultiTouch/Hold actions: </p>
    <ul>
      <li>BPM: TBD, will either be be greater control over bpm or swing</li>
      <li>Menu: N/A</li>
      <li>C: varies, along with a pattern it will delete the pattern</li>
      <li>Speaker: Sets volume</li>
      <li>Record: N/A</li>
      <li>S: TBD</li>
      <li>Play: N/A</li>
      <li>Pattern: Pattern chain mode with 1-16 (click again to exit)</li>
      <li>buttons 1-16: copy pattern a to b (pattern select screen), copy spot a to b (write mode)</li>
    </ul>
    <h3 id="visuals-explained">Visuals explained</h3>
    <p>Most of this has been done primarily with the goal of just leaving the flexibility for clearer visuals later. The green/grey box at the top of the screen will be used to provide whatever data needs to be more clearly conveyed if I ever get around to figuring that out.</p>
    <p><em>NOTE: I use hue-rotate to give the different devices different color schemes, so these colors are specifically for /solo/melody</em></p>
    <h4 id="button-backgrounds">Button backgrounds</h4>
    <ul>
      <li>BPM: Red middle (active)</li>
      <li>Record: Red middle (in write mode)</li>
      <li>S: Red middle (in sound select mode)</li>
      <li>Play: Red middle (playing pattern chain)</li>
      <li>Pattern: Red middle (in pattern select mode), Blue outline (pattern chain mode, desktop only), </li>
    </ul>
    <p>Index buttons</p>
    <ul>
      <li>default: Red (note playing)</li>
      <li>Sequence composition: red (active pattern), blue (spot to copy, click another index button to copy this spot)</li>
      <li>Patterns view: red middle (selected pattern), red and flashing (in pattern chain),  blue (pattern to copy, click another index button to copy this spot)</li>
    </ul>
    <h4 id="index-button-outlines">Index button outlines</h4>
    <p>These serve largely just to keep track of where we&#39;re at in the current sequence</p>
    <ul>
      <li>Green: currently playing pattern index</li>
      <li>Red: currently playing step in 16 step loop</li>
    </ul>
    <p>In composition mode when the active pattern is playing the red outlines will all sequentially fill up.</p>
    <h3 id="views">Views</h3>
    <ul>
      <li>default: play notes</li>
      <li>Record button on: write mode, select beats and notes for current 16 step pattern</li>
      <li>S button active: Sound select mode, selects the instrument for the loop and whether you&#39;re currently editing melody or the drum beats</li>
      <li>Pattern button active: Selecting a pattern to currently edit, also used to create current chain for playback and to copy patterns</li>
    </ul>
    <h3 id="walkthrough">Walkthrough</h3>
    <p>Not sure how useful this is, I&#39;ll do a video later</p>
    <ol>
      <li>Refresh page</li>
      <li>Click record button, this will open composition view, allowing you to edit the currently active pattern (default is the first pattern)</li>
      <li>Click any index, select a note when prompted, if you hold the note you can select how long it is played for</li>
      <li>Click sound button</li>
      <li>Select the bottom right sound option, this switches to drum mode</li>
      <li>click any index again, select a drum beat</li>
      <li>hit play, you should hear the beat looping (if not click the record button again and hit any note on the initial pad)</li>
      <li>click on patterns</li>
      <li>hold the first pattern, then select a second pattern to copy it</li>
      <li>add another sound to this pattern</li>
      <li>click on patterns again</li>
      <li>hold the patterns button, on desktop wait til it goes blue and then release</li>
      <li>(while still holding patterns on mobile) click the two patterns which you&#39;ve edited, if on desktop now click the patterns button again</li>
    </ol>
    <p>You should hear a sequence where it plays the two patterns you&#39;ve created in the sequence you&#39;ve chained them.</p>
    <h2 id="weird-technical-stuff">Weird Technical Stuff</h2>
    <h3 id="ui">UI</h3>
    <p>So the vast majority of what happens in this is dealt with via touch and click event on buttons which do specific actions onto the global state on the basis of that button&#39;s data attrbute values. As such, a large portion of the knowledge is contained within the HTML.</p>
    <p>In a perhaps ill-advised move, the UI is heavily built upon on specific component which handles all actions in the UI. The key actions are:</p>
    <ul>
      <li>click events</li>
      <li>multi-touch events</li>
      <li>touch-events</li>
    </ul>
    <h3 id="system-stuff">System stuff</h3>
    <p>In terms of system there are two key parts</p>
    <ul>
      <li>the &quot;Core&quot;: this is basically just your Redux style global store type deal, it processes each action triggered by the UI and passes the updates both back to the UI and out to the audio player</li>
      <li>the &quot;player&quot;: located in the Systems directory, this is a class object which handles everything related to Tone.js on the basis of what has occurred in the core. Each instance of the core is initialised with a player instance, as a result of this, the player is able to pass in custom actions into the core so the player behaviour can have a greater range of variety.</li>
    </ul>
    <p>The code in this component is currently pretty messy to handle all the edge cases, I&#39;ll probably split out specific versions later for readabilities sake. There is a separate context within the Components directory which handles an alternative means for multi touch actions on desktop devices.</p>
    <h2 id="credits">Credits</h2>
    <ul>
      <li>HEAVILY influenced by Teenage Engineering&#39;s Pocket Operator series, with major concessions made to fit workflow to a 320px wide screen. These are all amazing and you should buy one (I recommend PO-32 as a starting point, alternatively any of the first 3 are really fun albeit not as powerful)</li>
      <li>Tone.js <a href="https://github.com/Tonejs/Tone.js">https://github.com/Tonejs/Tone.js</a> for saving me a ton of time and having good documentation and responses to issues over the years</li>
    </ul>
    <h2>Promo stuff</h2>
    <ul>
    {[
        { link: 'github.com/padraigfl', text: 'Github' },
        { link: 'github.com/padraigfl/critic-lists', text: 'Source code'},
        { link: 'dvd-rom.netlify.app', text: 'DVD Menu Simulator' },
        { link: 'packard-belle.netlify.app', text: 'Windows98 Clone' },
        { link: 'react-coursebuilder.netlify.app', text: 'Youtube App thing' },
        { link: 'critics-list.netlify.app', text: 'End-of-year critics lists aggregator' },
        { link: 'github.com/padraigfl/us-bus-data', text: 'Loadsa bus data' },
      ].map(({link, text}, i) => (
        <li><a href={`https://${link}`} target="_blank">{text}</a></li>
      ))
    }
    </ul>
  </BoringWrapper>
);

export default About;
