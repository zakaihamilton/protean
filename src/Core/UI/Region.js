import { useEffect, useMemo, useState } from "react";
import { createState } from "src/Core/Base/State";

export function createRegion(displayName) {
    function Region({ target }) {
        const [region, setRegion] = useState({});
        useEffect(() => {
            if (target) {
                const resizeObserver = new ResizeObserver(entries => {
                    // Handle size changes here
                    const entry = entries[0];
                    const contentRect = entry.contentRect;
                    setRegion({
                        left: Math.floor(contentRect.left),
                        top: Math.floor(contentRect.top),
                        width: Math.floor(contentRect.width),
                        height: Math.floor(contentRect.height)
                    });
                });
                resizeObserver.observe(target);
                const rect = target.getBoundingClientRect();
                setRegion({
                    left: Math.floor(rect.left),
                    top: Math.floor(rect.top),
                    width: Math.floor(rect.width),
                    height: Math.floor(rect.height)
                });
                return () => {
                    resizeObserver.unobserve(target);
                };
            }
        }, [target]);
        return <Region.State {...region} />;
    }
    Region.State = createState(displayName);
    Region.useRegion = Region.State.useState;
    return Region;
}
