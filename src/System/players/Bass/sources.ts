import * as Tone from 'tone';
import { instrumentBuildParams } from '../../_types';
import { melodySoundSources } from '../Melody/sources';

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

  