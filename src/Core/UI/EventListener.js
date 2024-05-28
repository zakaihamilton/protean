import { useEffect } from 'react';

export function useEventListener(target, eventName, listener, options = {}) {
    useEffect(() => {
        if (!target || !listener) {
            return;
        }
        target.addEventListener(eventName, listener, options);

        return () => {
            if (!target || !listener) {
                return;
            }
            target.removeEventListener(eventName, listener, options);
        };
    }, [eventName, options, target, listener]);
}
