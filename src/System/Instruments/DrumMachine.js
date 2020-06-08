import Tone from 'tone';

import { generateKeys } from '../_utils';

export class DrumMachine extends Tone.Players {
  playing = [];
  overlap = false;
  keyMap;
  baseVolume = 0;

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
    this.setVolume(note);
    this.keyMap[note].start();
  }

  triggerAttack(note) {
    this.setVolume(note);
    this.keyMap[note].start();
  }

  triggerRelease(note) {
    // this.keyMap[note].stop();
  }
  setVolume(idx) {
    if (this.customVolumes && this.customVolumes[idx] && this.volumne.value !== this.customVolumes[idx]) {
      this.volume.value = this.customVolumes;
      return;
    }
    if (this.volume.value !== this.baseVolume) {
      this.volume.value = this.baseVolume;
    }
  }
}

export default DrumMachine;
