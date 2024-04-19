import { useCallback, useEffect, useMemo, useState } from "react";

export function useElement() {
    const [node, setNode] = useState(null);
    const callback = useCallback(node => {
        setNode(node);
    }, []);
    useMemo(() => {
        callback.current = node;
    }, [callback, node]);
    return callback;
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

function Element() {
    
}

export default Element;