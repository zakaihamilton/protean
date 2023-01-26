import { useCallback, useEffect, useState } from "react";

export function useElement() {
    const [node, setNode] = useState(null);
    const callback = useCallback(node => {
        setNode(node);
    }, []);
    callback.current = node;
    return callback;
}

export function useElementConstructor(element, constructor) {
    const handle = element?.current;
    useEffect(() => {
        if (constructor) {
            return constructor(handle);
        }
    }, [handle, constructor]);
}
