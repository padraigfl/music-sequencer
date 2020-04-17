export const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const generateKeys = (start = 3) => {
  const sounds = [];
  for (let i = 0; i < 16; i++) {
    sounds.push({ id: `${notes[i % 7]}${start + Math.floor(i / 7)}`});
  }
  return sounds;
};

export const getEmptyPattern = (size = 16) => {
  return {
    spots: new Array(size).fill({
      note: null,
    }),
    drums: new Array(size).fill({ note: null }),
    effects: {},
  };
};

export const getCorrectParent = (gridRef) => (currentEl) => {
  const gridEl = gridRef.current;
  if (!currentEl.parentNode) {
    throw Error('Out of range selection');
  }
  if (currentEl.parentNode === gridEl) {
    return currentEl;
  }
  return getCorrectParent(gridRef)(currentEl.parentNode);
}
