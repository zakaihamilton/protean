import { useEffect, useMemo, useState } from "react";
import { createState } from "src/Core/Base/State";

export function createRegion(displayName) {
    function Region({ target }) {
        const [region, setRegion] = useState({});
        useEffect(() => {
            if (target) {
                setRegion(target.getBoundingClientRect());
            }
            else {
                setRegion({});
            }
        }, [target]);
        return <Region.State {...region} />;
    }
    Region.State = createState(displayName);

    return Region;
}

export function useRegion(target) {
    const [counter, setCounter] = useState(0);
    useEffect(() => {
        if (!target) {
            return;
        }
        const observer = new ResizeObserver(() => {
            setCounter(counter => counter + 1);
        });
        observer.observe(target);
        return () => {
            observer.unobserve(target);
        };
    }, [target]);
    const region = useMemo(() => {
        if (!target) {
            return null;
        }
        return target.getBoundingClientRect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, counter]);
    return region;
}
