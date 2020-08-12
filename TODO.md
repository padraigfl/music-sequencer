# TODO list

Key Functions

- [x] Plays notes
- [x] Creates sequences
- [x] Changes instruments
- [x] Has drum mode
- [x] Multiple patterns
- [x] Chains patterns
- [x] Volume controls
- [x] Preserve chains (localStorage)
- [x] Split Tone.js from interface and context
- [] Cancel button as universal reset
- [] Apply effects (syncing issues if on network?)

UI

- [] Menu with extended options
- [] UI Screen plan
  - [] display essential data
  - [] variants for view mode
  - [] help screen overlay
- [] Darker mode (swap white buttons with black)

Bugs

- [x] occasional lag on mobile (number of elements being rendered)
- [] iOS only plays when silent switch is off (may not be resolvable)
- [] double play of notes (onClick bug, Android)
- [] all samples have release value of 1 ??
- [] pattern chain light not loading and occasionally bugging out

Tidyup

- [x] Typescript
- [] Swap switch statements with indexed objects
- [] Tests of operations
- [] Tutorial
  - [x] implement react-joyride
  - [] style and restrict functionality
  - [] receive feedback on improvements
  - [] gifs, possibly??
- [] Improve sounds
  - [] select better variety of drums and synths
  - [] balance audio output better
  - [] try to avoid unnecessary static

Expanded

- [] Multiple "players" (i.e. alternative play modes than the existing one instrument + basic drum machine)
- [] Multiple instruments simultaneous play
  - [] localStorage comboset
  - [] Network interplay via websockets
