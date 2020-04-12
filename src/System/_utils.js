export const PLAY = 'play';
export const WRITE = 'write';
export const PATTERN = 'pattern';
export const BPM = 'bpm';
export const VOLUME = 'volume';
export const SOUND = 'sound';

export const getInitialState = sounds => ({
  [PLAY]: false,
  [WRITE]: false,
  [PATTERN]: false,
  [BPM]: 120,
  [VOLUME]: 1,
  [SOUND]: sounds[0],
});

export const updateSingleField = (state, key, value) => {
  return {
    ...state,
    [key]: value,
  };
}

const getSyncBpmOptions = (base) => [base/4, base/2, base, base * 2, base * 4].filter(v => v > 30 && v < 320);

export const rotateBpm = (value, base) => {
  const options = base ? getSyncBpmOptions(base) :  [80, 100, 120, 140, 320];
  return (options.find(v => v > value) || 80);
}




