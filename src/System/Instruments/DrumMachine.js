import Tone from 'tone';

import { generateKeys } from '../_utils';

export class DrumMachine extends Tone.Players {
  playing = [];
  overlap = false;
  keyMap;

  constructor({ beats, baseUrl, customKeys }) {
    let beatArray = beats.map(v => `${baseUrl}${v}`)
    super(beatArray);
    this.keyMap = generateKeys().reduce((acc, key, idx) => ({
      ...acc,
      [key.id]: this.get(idx),
    }), {});
    if (customKeys) {
      this.customKeys = customKeys;
    }
  }

  triggerAttackRelease(note) {
    this.keyMap[note].start();
  }

  triggerAttack(note) {
    this.keyMap[note].start();
  }

  triggerRelease(note) {
    // this.keyMap[note].stop();
  }
}

export default DrumMachine;
