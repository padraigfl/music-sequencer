export const datasetStringParse = (dataset) => (
  Object.entries(dataset).reduce((acc, [key, val]) => {
    let value;
    try {
      value = JSON.parse(val);
    } catch {
      if (val !== 'undefined') {
        value = val;
      }
    }
    return {
      ...acc,
      [key]: value,
    };
  }, {})
);

export const getEmptyPattern = (size = 16) => {
  return {
    spots: new Array(size).fill({
      note: null,
    }),
    drums: new Array(size).fill({ note: null }),
    effects: {},
  };
};

export const getButtonData = (target) => {
  if (target instanceof HTMLButtonElement) {
    return datasetStringParse(target.dataset);
  }
  if (target.parentNode) {
    return getButtonData(target.parentNode);
  }
  return null;
}

export const getTouchValues = (e) => (
  [ ...e.targetTouches ].map( ({ target }) => (
    getButtonData(target)
  )).filter(v => !!v)
);
