import { useCallback, useEffect, useState } from 'react';

export function useElement() {
  const [element, setElement] = useState(null);
  const callback = useCallback((node) => {
    setElement(node);
  }, []);

  return [element, callback];
}

export function useElementConstructor(element, initializer) {
  const handle = element?.current;
  useEffect(() => {
    if (!handle) {
      return;
    }
    if (initializer) {
      return initializer(handle);
    }
  }, [handle, initializer]);
}
