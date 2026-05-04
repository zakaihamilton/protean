import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createState } from 'src/Core/Base/State';

export function useMonitorSizeOfElements(elements) {
  const [counter, setCounter] = useState(0);
  const observedElementsMapRef = useRef(new Map());
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver((entries) => {
      let hasDimensionChanged = false;
      const currentMap = observedElementsMapRef.current;

      for (const entry of entries) {
        const element = entry.target;
        if (currentMap.has(element)) {
          const rect = element.getBoundingClientRect();
          const newDimensions = {
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
          const lastKnownDimensions = currentMap.get(element);

          if (
            lastKnownDimensions.width !== newDimensions.width ||
            lastKnownDimensions.height !== newDimensions.height
          ) {
            currentMap.set(element, newDimensions);
            hasDimensionChanged = true;
          }
        }
      }

      if (hasDimensionChanged) {
        setCounter((counter) => counter + 1);
      }
    });

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    const observer = resizeObserverRef.current;
    if (!observer) return;

    observedElementsMapRef.current.forEach((_, element) => {
      observer.unobserve(element);
    });
    observedElementsMapRef.current.clear();

    const validElementsToObserve = (elements || []).filter((el) => el);

    validElementsToObserve.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const initialDimensions = {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
      observedElementsMapRef.current.set(element, initialDimensions);
      observer.observe(element);
    });
  }, [elements]);

  return counter;
}

function findIntersectingElements(element, elements) {
  const intersectingElements = [];
  const elementRect = element.getBoundingClientRect();
  for (const otherElement of elements) {
    if (otherElement === element) {
      continue;
    }
    const otherRect = otherElement.getBoundingClientRect();
    const isIntersectingHorizontally =
      elementRect.left < otherRect.right && elementRect.right > otherRect.left;
    const isIntersectingVertically =
      elementRect.top < otherRect.bottom && elementRect.bottom > otherRect.top;
    if (isIntersectingHorizontally && isIntersectingVertically) {
      intersectingElements.push(otherElement);
    }
  }
  return intersectingElements;
}

export function getHitTargets(parent, child) {
  if (!parent || !child) {
    return null;
  }
  const elements = [...parent.children];
  const hits = findIntersectingElements(child, elements);

  return hits;
}

export function getOffsetRect(element) {
  if (!element) {
    return undefined;
  }
  const rect = {
    left: 0,
    top: 0,
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
  let current = element;

  while (current && current !== document.body) {
    const computedStyle = window.getComputedStyle(current);
    const position = computedStyle.getPropertyValue('position');

    if (position === 'relative' || position === 'absolute') {
      rect.left += current.offsetLeft - current.scrollLeft;
      rect.top += current.offsetTop - current.scrollTop;
      break;
    }

    current = current.parentElement;
  }

  return rect;
}

export function createRegion(displayName) {
  function Region({ target, delay = 50, counter }) {
    const [region, setRegion] = useState({});
    // biome-ignore lint/correctness/useExhaustiveDependencies: the counter and target are the primary triggers for manual and automated region updates
    const updateRegion = useCallback(() => {
      if (!target) {
        return;
      }
      const rect = target.getBoundingClientRect();
      const left = Math.floor(rect.left);
      const top = Math.floor(rect.top);
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      setRegion((prev) => {
        if (
          prev.left === left &&
          prev.top === top &&
          prev.width === width &&
          prev.height === height
        ) {
          return prev;
        }
        return {
          left,
          top,
          width,
          height,
        };
      });
    }, [target, counter]);
    useEffect(() => {
      const timerHandle = setTimeout(updateRegion, delay);
      return () => {
        clearTimeout(timerHandle);
      };
    }, [updateRegion, delay]);
    useEffect(() => {
      if (target) {
        const resizeObserver = new ResizeObserver(() => {
          updateRegion();
        });
        resizeObserver.observe(target);
        window.addEventListener('scroll', updateRegion, true);
        window.addEventListener('resize', updateRegion);
        return () => {
          resizeObserver.unobserve(target);
          window.removeEventListener('scroll', updateRegion, true);
          window.removeEventListener('resize', updateRegion);
        };
      }
    }, [target, updateRegion]);
    return <Region.State {...region} />;
  }
  Region.State = createState(displayName);
  Region.useRegion = Region.State.useState;
  return Region;
}
