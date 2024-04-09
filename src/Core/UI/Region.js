import { useCallback, useEffect, useMemo, useState } from "react";
import { createState } from "src/Core/Base/State";

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
