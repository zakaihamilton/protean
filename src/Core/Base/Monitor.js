import { useEffect } from "react";

export function useMonitor(objects, key, handler) {
    useEffect(() => {
        if (!objects || !handler) {
            return;
        }
        for (const object of objects) {
            if (!object) {
                continue;
            }
            object.__monitor(key, handler);
        }
        return () => {
            for (const object of objects) {
                if (!object) {
                    continue;
                }
                object.__unmonitor(key, handler);
            }
        };
    }, [objects, key, handler]);
}
