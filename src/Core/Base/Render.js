import { useState, useRef, useCallback, useEffect } from 'react';

export function useBatchedRender() {
    const [, setCounter] = useState(0);

    const isUpdateScheduledRef = useRef(false);

    const setCounterRef = useRef(setCounter);
    useEffect(() => {
        setCounterRef.current = setCounter;
    }, [setCounter]);

    const requestRender = useCallback(() => {
        if (!isUpdateScheduledRef.current) {
            isUpdateScheduledRef.current = true;

            const performUpdate = () => {
                setCounterRef.current(count => count + 1);
                isUpdateScheduledRef.current = false;
            };

            if (typeof queueMicrotask === 'function') {
                queueMicrotask(performUpdate);
            } else {
                Promise.resolve().then(performUpdate);
            }
        }
    }, []);

    return requestRender;
}
