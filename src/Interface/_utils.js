export const getEmptyPattern = (size = 16) => {
  return {
    spots: new Array(size).fill({
      note: null,
    }),
    drums: new Array(size).fill({ note: null }),
    effects: {},
  };
};

// just use currentTarget?
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

