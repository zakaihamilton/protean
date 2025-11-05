import { useCallback, useEffect, useMemo, useState } from "react";

export function useElement() {
    const [node, setNode] = useState(null);
    const callback = useCallback(node => {
        setNode(node);
    }, []);

    return [node, callback];
}

export function useElementConstructor(element, constructor) {
    const handle = element?.current;
    useEffect(() => {
        if (!handle) {
            return;
        }
        if (constructor) {
            return constructor(handle);
        }
    }, [handle, constructor]);
}
