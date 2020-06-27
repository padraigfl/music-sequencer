# Music App Thing

(Designed primarily with mobiles in mind)

## What this does?

Originally I was just going to do a straight up replica of a Teenage Engineering Pocket Operator, but as I was using it very early on I realised it'd be way more fun to make something based on that kind of premise but designed to work on a mobile phone. 

- 16 step sequencer
- 16 instrument options
- Save 16 sixteen step patterns
- Which you can then chain in whatever order you like
- (On the existing players) each pattern contains two parts, the melody (played with a selected instrument from options 1-15) and a simple beat (using instrument 16).

There's a largely redundant space at the top of the screen that will be used to more clearly convey what's going on when I know which bits are most confusing.

It may be beneficial to watch some videos of pocket operators first to get an idea of what this would love to be.

## How it works

https://padraig-operator.netlify.app/solo/melody/tutorial will hopefully explain some of it, it's quite buggy right now unfortunately.

As it was primarily designed with phones in mind, I designed everything with two point multitouch in mind. The solutions for desktop involve holding down the first value of a multitouch and then selecting the second after it turns blue.

The order in which buttons is pressed is important, but I'll hopefully resolve this later.

### Buttons

Click actions:

- BPM: toggles the bmp between a series of options
- Menu: Goes to home page
- C: cancel button, unfinished but basically a catch all (I wanna get out of this)
- Speaker: Mute/Unmute
- Record: Enter write mode
- S: Select sound to use
- Play: play pause
- Pattern: select pattern to edit (may require to be held on android for the moment)
- buttons 1-16: varies on mode (select note/duration/pattern/spot/sound/..., default is play note)

MultiTouch/Hold actions: 

- BPM: TBD, will either be be greater control over bpm or swing
- Menu: N/A
- C: varies, along with a pattern it will delete the pattern
- Speaker: Sets volume
- Record: N/A
- S: TBD
- Play: N/A
- Pattern: Pattern chain mode with 1-16 (click again to exit)
- buttons 1-16: copy pattern a to b (pattern select screen), copy spot a to b (write mode)

### Visuals explained

Most of this has been done primarily with the goal of just leaving the flexibility for clearer visuals later. The green/grey box at the top of the screen will be used to provide whatever data needs to be more clearly conveyed if I ever get around to figuring that out.

*NOTE: I use hue-rotate to give the different devices different color schemes, so these colors are specifically for /solo/melody*

#### Button backgrounds

- BPM: Red middle (active)
- Record: Red middle (in write mode)
- S: Red middle (in sound select mode)
- Play: Red middle (playing pattern chain)
- Pattern: Red middle (in pattern select mode), Blue outline (pattern chain mode, desktop only), 

Index buttons
- default: Red (note playing)
- Sequence composition: red (active pattern), blue (spot to copy, click another index button to copy this spot)
- Patterns view: red middle (selected pattern), red and flashing (in pattern chain),  blue (pattern to copy, click another index button to copy this spot)

#### Index button outlines

These serve largely just to keep track of where we're at in the current sequence

- Green: currently playing pattern index
- Red: currently playing step in 16 step loop

In composition mode when the active pattern is playing the red outlines will all sequentially fill up.

### Views

- default: play notes
- Record button on: write mode, select beats and notes for current 16 step pattern
- S button active: Sound select mode, selects the instrument for the loop and whether you're currently editing melody or the drum beats
- Pattern button active: Selecting a pattern to currently edit, also used to create current chain for playback and to copy patterns


### Walkthrough

Not sure how useful this is, I'll do a video later

1. Refresh page
1. Click record button, this will open composition view, allowing you to edit the currently active pattern (default is the first pattern)
1. Click any index, select a note when prompted, if you hold the note you can select how long it is played for
1. Click sound button
1. Select the bottom right sound option, this switches to drum mode
1. click any index again, select a drum beat
1. hit play, you should hear the beat looping (if not click the record button again and hit any note on the initial pad)
1. click on patterns
1. hold the first pattern, then select a second pattern to copy it
1. add another sound to this pattern
1. click on patterns again
1. hold the patterns button, on desktop wait til it goes blue and then release
1. (while still holding patterns on mobile) click the two patterns which you've edited, if on desktop now click the patterns button again

You should hear a sequence where it plays the two patterns you've created in the sequence you've chained them.


## Weird Technical Stuff

## UI

So the vast majority of what happens in this is dealt with via touch and click event on buttons which do specific actions onto the global state on the basis of that button's data attrbute values. As such, a large portion of the knowledge is contained within the HTML.

In a perhaps ill-advised move, the UI is heavily built upon on specific component which handles all actions in the UI. The key actions are:
- click events
- multi-touch events
- touch-events

### System stuff

In terms of system there are two key parts

- the "Core": this is basically just your Redux style global store type deal, it processes each action triggered by the UI and passes the updates both back to the UI and out to the audio player
- the "player": located in the Systems directory, this is a class object which handles everything related to Tone.js on the basis of what has occurred in the core. Each instance of the core is initialised with a player instance, as a result of this, the player is able to pass in custom actions into the core so the player behaviour can have a greater range of variety.

The code in this component is currently pretty messy to handle all the edge cases, I'll probably split out specific versions later for readabilities sake. There is a separate context within the Components directory which handles an alternative means for multi touch actions on desktop devices.

## Credits

- HEAVILY influenced by Teenage Engineering's Pocket Operator series, with major concessions made to fit workflow to a 320px wide screen. These are all amazing and you should buy one (I recommend PO-32 as a starting point, alternatively any of the first 3 are really fun albeit not as powerful)
- Tone.js https://github.com/Tonejs/Tone.js for saving me a ton of time and having good documentation and responses to issues over the years
