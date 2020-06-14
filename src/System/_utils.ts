import Tone from 'tone';

import { NOTES } from '../Core/_constants';
import { instrumentBuildParams, keyData } from './_types';

export const generateKeys = (start: number = 3): keyData[] => {
  const sounds = [];
  for (let i = 0; i < 16; i++) {
    sounds.push({ id: `${NOTES[i % 7]}${start + Math.floor(i / 7)}`});
  }
  return sounds;
};

export const generateInstrument = ({
  title,
  instrument = Tone.Synth,
  toneParams = [],
  customKeys,
  idx,
}: instrumentBuildParams) => {
  const tone =  new instrument(...toneParams);
  return {
    name: title || tone.toString().split('Synth')[0] || 'Synth',
    tone,
    keys: customKeys,
    idx,
  }
}
