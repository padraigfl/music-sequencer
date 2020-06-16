import Tone from 'tone';

export type instrumentBuildParams = {
  title?: string;
  instrument?: Tone.Synth;
  toneParams?: any[];
  customKeys?: string[];
  idx?: number,
}
export type keyData = {
  id: string;
};