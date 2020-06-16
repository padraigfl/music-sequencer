import Tone from 'tone';

import { generateKeys } from '../_utils';

export class DrumMachine extends Tone.Players {
  playing = [];
  overlap = false;
  keyMap = {};
  baseVolume = 0;
  name = 'basicDrum'

  constructor({ sources, baseUrl, startNote = 'c3', baseVolume = 0 }) {
    let beatArray = [];
    let customKeys = [];

    sources.forEach(({ name, src }) => {
      beatArray.push(`${baseUrl}${src}`);
      customKeys.push(name);
    });
  
    super(beatArray);
    this.baseVolume = baseVolume;

    generateKeys(+startNote[1]).forEach((key, idx) => {
      this.keyMap[key.id] = {
        player: this.get(idx),
        data: sources[idx],
      };
    });

    if (customKeys.filter(v => !!v).length) {
      this.customKeys = customKeys;
    }
  }

  triggerAttackRelease(note) {
    const { data, player } =  this.keyMap[note];
    this.setVolume(data);
    player.start();
  }

  triggerAttack(note) {
    this.triggerAttackRelease(note);
  }

  triggerRelease(note) {
    // this.keyMap[note].stop();
  }
  setVolume(data) {
    if (data && data.volume && data.volume !== this.volume.value) {
      this.volume.value = data.volume;
      return;
    }
    if (typeof data.volume === 'undefined' && this.volume.value !== this.baseVolume) {
      this.volume.value = this.baseVolume;
    }
  }
}

export default DrumMachine;
