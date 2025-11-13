import { useCallback, useEffect, useState, useLayoutEffect, useRef } from "react";
import { createState } from "src/Core/Base/State";

export function useMonitorSizeOfElements(elements) {
    const [counter, setCounter] = useState(0);
    const observedElementsMapRef = useRef(new Map());
    const resizeObserverRef = useRef(null);

    useEffect(() => {
        resizeObserverRef.current = new ResizeObserver(entries => {
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

                    if (lastKnownDimensions.width !== newDimensions.width ||
                        lastKnownDimensions.height !== newDimensions.height) {
                        currentMap.set(element, newDimensions);
                        hasDimensionChanged = true;
                    }
                }
            }

            if (hasDimensionChanged) {
                setCounter(counter => counter + 1);
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

        const validElementsToObserve = (elements || []).filter(el => el);

        validElementsToObserve.forEach(element => {
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
        const isIntersectingHorizontally = elementRect.left < otherRect.right && elementRect.right > otherRect.left;
        const isIntersectingVertically = elementRect.top < otherRect.bottom && elementRect.bottom > otherRect.top;
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
        height: element.offsetHeight
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
    function Region({ target, counter, delay = 50 }) {
        const [region, setRegion] = useState({});
        const updateRegion = useCallback(() => {
            if (!target) {
                return;
            }
            const rect = target.getBoundingClientRect();
            setRegion({
                left: Math.floor(rect.left),
                top: Math.floor(rect.top),
                width: Math.floor(rect.width),
                height: Math.floor(rect.height)
            });
        }, [target]);
        useEffect(() => {
            const timerHandle = setTimeout(updateRegion, delay);
            return () => {
                clearTimeout(timerHandle);
            }
        }, [counter, updateRegion, delay]);
        useEffect(() => {
            if (target) {
                const resizeObserver = new ResizeObserver(() => {
                    updateRegion();
                });
                resizeObserver.observe(target);
                return () => {
                    resizeObserver.unobserve(target);
                };
            }
        }, [target, updateRegion]);
        return <Region.State {...region} />;
    }
    Region.State = createState(displayName);
    Region.useRegion = Region.State.useState;
    return Region;
}
