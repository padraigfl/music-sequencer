import { useState, useEffect, useCallback } from 'react';

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

export const useMultiTouch = (initialVal = [], multiTouchAction, clearOnAction) => {
  const [multiTouchValues, updateMultiTouchValues] = useState(initialVal);
  const [initialHeldValue, updateFirstValue] = useState(null);

  useEffect(() => {
    if (!multiTouchValues.length && initialHeldValue) {
      updateFirstValue(null);
    }
  }, []);

  const updateMultiTouch = useCallback((buttonData, { clear, clearAll }) => {
    if (clear || clearAll) {
      updateMultiTouchValues(
        clear
        ? multiTouchValues.filter(v => v.action !== buttonData.action && v.value !== buttonData.value)
        : []
      );
      return;
    }
    const inList = multiTouchValues.find(
      v =>
        v.action === buttonData.action
        && v.value === buttonData.value
    );
    if (!inList) {
      updateMultiTouchValues([...multiTouchValues, buttonData]);
    } else if (inList) {
      updateMultiTouchValues(
        multiTouchValues.filter(
          v => v.action !== buttonData.action
            && v.value !== buttonData.value
        )
      );
    }
  }, [multiTouchValues]);

  console.log(multiTouchValues);
  return [multiTouchValues, updateMultiTouch];
};

