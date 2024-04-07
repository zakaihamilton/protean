import { useEffect } from 'react';

export function useEventListener(target, eventName, listener, options = {}) {
    useEffect(() => {
        if (!target) {
            return;
        }
        target.addEventListener(eventName, listener, options);

        return () => {
            target.removeEventListener(eventName, listener, options);
        };
    }, [eventName, options, target, listener]);
}
