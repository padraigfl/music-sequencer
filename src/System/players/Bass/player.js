import MelodyPlayer from '../Melody/player';
import { bassSoundSources } from './sources';
import { generateInstrument } from '../../_utils';
import { generateDrumMachine } from '../../Instruments/_sources';

class LazyBass extends MelodyPlayer {
  static colorFilter = 'hue-rotate(90deg) saturate(5)';
  static startNote = 'c1';
  static sources = bassSoundSources;
  static sounds = [
    ...LazyBass.sources.map((v, idx) => ({ ...generateInstrument(v), id: idx })),
    generateDrumMachine(LazyBass.startNote, LazyBass.sources.length),
  ];

  constructor(...params) {
    super(...params, LazyBass);
    window.playa = this;
    this.startNote = LazyBass.startNote;
  }

  getNewPlaysound = (idx) => {
    let newPlaySound = idx < 15
      ? generateInstrument(bassSoundSources[idx])
      : generateDrumMachine(LazyBass.startNote, idx);

    newPlaySound.tone.toMaster();
    return newPlaySound;
  }
}

export default LazyBass;
