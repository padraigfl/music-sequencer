import * as Tone from 'tone';
import { instrumentBuildParams } from '../../_types';
import { melodySoundSources } from '../Melody/sources';

export const pianoSource = [1,2,,3,4,5,6,7,8]
  .reduce((acc, val) => (
    { ...acc, [`C${val}`]: `C${val}.[mp3|ogg]`}
    ), {});

export const bassSoundSources: instrumentBuildParams[] = melodySoundSources.map((v) => {
  if (v.instrument === Tone.Sampler) {
    return {
      ...v,
      toneParams: [ v.toneParams[0], { ...v.toneParams[1], volume: 15 }],
    };
  }
  return {
    ...v,
    toneParams: Array.isArray(v.toneParams) && v.toneParams.length
      ? [{ ...v.toneParams[0], volume: 15 }, ...v.toneParams.slice(1)]
      : [{ volume: 15}]
  }
});

  