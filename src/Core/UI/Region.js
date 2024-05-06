import { useCallback, useEffect, useMemo, useState } from "react";
import { createState } from "src/Core/Base/State";


function findIntersectingCenterElements(element, elements) {
    const intersectingElements = [];
    const elementRect = element.getBoundingClientRect();
    for (const otherElement of elements) {
        if (otherElement === element) {
            continue;
        }
        const otherRect = otherElement.getBoundingClientRect();
        const isIntersectingHorizontally = elementRect.left + elementRect.width / 2 < otherRect.right && elementRect.right - elementRect.width / 2 > otherRect.left;
        const isIntersectingVertically = elementRect.top < otherRect.bottom && elementRect.bottom > otherRect.top;
        if (isIntersectingHorizontally && isIntersectingVertically) {
            intersectingElements.push(otherElement);
        }
    }
    return intersectingElements;
}

export function getCenterHitTargets(parent, child) {
    if (!parent || !child) {
        return null;
    }
    const elements = [...parent.children];
    const hits = findIntersectingCenterElements(child, elements);

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
