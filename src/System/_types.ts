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

export type Sound = {
  name: string;
  tone: Tone.Instrument;
  toneParams?: any[];
  keys?: string[];
  idx?: number;
};
