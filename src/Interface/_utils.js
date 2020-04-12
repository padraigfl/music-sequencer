
export const generateKeys = (start = 3) => {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const sounds = [];
  for (let i = 0; i < 16; i++) {
    sounds.push({ id: `${notes[i % 7]}${start + Math.floor(i / 7)}`});
  }
  return [
    sounds.slice(0,4),
    sounds.slice(4,8),
    sounds.slice(8,12),
    sounds.slice(12,16),
  ].reverse().flat();
};

export const getEmptyPattern = (size = 16) => {
  return {
    spots: new Array(size).fill({
      note: null,
    }),
    effects: {},
  };
};
