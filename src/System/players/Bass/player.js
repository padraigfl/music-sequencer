import MelodyPlayer from '../Melody/player';
import { bassSoundSources } from './sources';
import { generateInstrument } from '../../_utils';
import { generateDrumMachine } from '../../Instruments/_sources';

class LazyBass extends MelodyPlayer {
  static colorFilter = 'hue-rotate(90deg) saturate(5)';
  static startNote = 'c1';
  static sounds = [
    ...bassSoundSources.map((v, idx) => ({ ...generateInstrument(v), id: idx })),
    generateDrumMachine(LazyBass.startNote, bassSoundSources.length),
  ];

  constructor(...params) {
    super(...params);
    window.playa = this;
    this.startNote = LazyBass.startNote
    this.playerSounds = LazyBass.sounds;
    this.sound = generateInstrument(bassSoundSources[0]);
    this.melodySound = this.playerSounds[0];
    this.basicDrum = this.playerSounds[15];
    this.instantiate();
  }

  getNewPlaysound = (idx) => {
    let newPlaySound = idx < 15
      ? generateInstrument(bassSoundSources[idx])
      : generateDrumMachine(this.startNote, idx);

    newPlaySound.tone.toMaster();
    return newPlaySound;
  }
}

export default LazyBass;
