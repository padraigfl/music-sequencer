export const datasetStringParse = (dataset = {}): Object => (
  Object.entries(dataset).reduce(
    (acc: Object, [key, val]: [string, string]) => {
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

export const getButtonData = (target: HTMLElement): { action?: string, secondary?: string, value?: string } => {
  if (target instanceof HTMLButtonElement) {
    return datasetStringParse(target.dataset);
  }
  if (target.parentNode instanceof HTMLElement) {
    return getButtonData(target.parentNode);
  }
  return null;
}

export const getTouchValues = (e: TouchEvent): Object => {
  const touchArray = [];
  for( let i = 0; i < e.touches.length; i++) {
    touchArray.push(e.touches[i]);
  }
  return (
    touchArray.map( ({ target }) => (
      getButtonData(target)
    )).filter(v => !!v)
  );
};
