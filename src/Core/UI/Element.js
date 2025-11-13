import { useCallback, useEffect, useMemo, useState } from "react";

export function useElement() {
    const [element, setElement] = useState(null);
    const callback = useCallback(node => {
        setElement(node);
    }, []);

    return [element, callback];
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
