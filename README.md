# Music App Thing

## What this does?

Originally I was just going to do a straight up replica of a Teenage Engineering Pocket Operator, but as I was using it very early on I realised it'd be way more fun to make something based on that kind of premise but designed to work on a mobile phone. 

It's a 16 step sequencer which lets you save 16 patterns which you can then chain in whatever order you like. Each pattern contains two parts, the melody and a simple beat.

You can choose from 15 different presets (sounds 1-15) for the melody and from 16 samples for the beat (sound 16)

There's a largely redundant space at the top of the screen that will be used to more clearly convey what's going on when I know which bits are most confusing.

## How it works

As it was primarily designed with phones in mind, I designed everything with two point multitouch in mind. The solutions for desktop involve holding down the first value of a multitouch and then selecting the second after it turns blue.

The order in which buttons is pressed is important, but I'll hopefully resolve this later.

### Buttons

Click actions:

- BPM: toggles the bmp between a series of options
- Menu: TBD
- C: cancel button, unfinished but basically a catch all (I wanna get out of this)
- Speaker: TBD, probably mute/unmute
- Record: Enter write mode
- S: Select sound to use
- Play: play pause
- Pattern: select pattern to edit
- buttons 1-16: varies on mode (select note/duration/pattern/spot/sound/..., default is play note)

MultiTouch/Hold actions: 

- BPM: TBD
- Menu: N/A
- C: TBD
- Speaker: TBD, probably mute/unmute
- Record: N/A
- S: TBD
- Play: N/A
- Pattern: Pattern chain mode with 1-16 (click again to exit)
- buttons 1-16: copy pattern a to b (pattern select screen), copy spot a to b (write mode)

### Visuals explained

#### Button backgrounds

- BPM: Green (active)
- Record: Green (in write mode)
- S: Green (in sound select mode)
- Play: Green (playing pattern chain)
- Pattern: Green BG (in pattern select mode), Blue outline (pattern chain mode, desktop only)

Index buttons
- default: green (note playing)
- Sequence composition: red (active pattern), blue (spot to copy, click another index button to copy this spot)
- Patterns view: green (selected pattern), red (in pattern chain),  blue (pattern to copy, click another index button to copy this spot)

#### Index button outlines

These serve largely just to keep track of where we're at in the current sequence

- Green: currently playing pattern index
- Red: currently playing step in 16 step loop

### Views

- default: play notes
- Record button on: write mode, select beats and notes for current 16 step pattern
- S button active: Sound select mode, selects the instrument for the loop and whether you're currently editing melody or the drum beats
- Pattern button active: Selecting a pattern to currently edit, also used to create current chain for playback and to copy patterns


### Walkthrough

Not sure how useful this is, I'll do a video later

1. Refresh page
1. Click record button
1. Click any index, select a note when prompted, then select a number for how many steps you want that note to be held
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