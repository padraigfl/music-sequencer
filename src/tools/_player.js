import Tone from "tone";

export const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const generateKeys = (start = 3) => {
  const sounds = [];
  for (let i = 0; i < 16; i++) {
    sounds.push({ id: `${notes[i % 7]}${start + Math.floor(i / 7)}`});
  }
  return sounds;
};

// for mapping drum beats to keys
export const samplerKeys = (values) => {
  const keys = generateKeys();
  let sampleMap = {};
  values.forEach((val, idx) => {
    sampleMap[keys[idx]] = val;
  });
  return sampleMap;
};

const moduloIndex = idx =>  idx ? idx % 16 : 0;

export class DrumMachine extends Tone.Players {
  playing = [];
  overlap = false;
  keyMap;

  constructor({ beats, baseUrl }) {
    let beatArray = beats.map(v => `${baseUrl}${v}`)
    super(beatArray);
    this.keyMap = generateKeys().reduce((acc, key, idx) => ({
      ...acc,
      [key.id]: this.get(idx),
    }), {});
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