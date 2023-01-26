import { useCallback, useEffect } from "react";
import { createState } from "./State";

export function createEvents(...args) {
    const State = createState(...args);
    State.useEvent = (type, callback, ...args) => {
        const state = State.useState([], ...args);
        useEffect(() => {
            if (!state) {
                return;
            }
            state[type] = callback;
            return () => {
                delete state[type];
            };
        }, [type, callback, state]);
    };
    State.useEventsAsListeners = (target, nodeId) => {
        const state = State.useState(undefined, nodeId);
        const entries = state && Object.entries(state) || [];
        useEffect(() => {
            if (!target) {
                return;
            }
            for (const [key, listener] of entries) {
                target.addEventListener(key, listener);
            }
            return () => {
                for (const [key, listener] of entries) {
                    target.removeEventListener(key, listener);
                }
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [target, state?.__counter]);
    };
    State.useEventsAsFlow = (nodeId) => {
        const state = state.useState([], nodeId);
        const flow = useCallback((...args) => {
            const callbacks = Object.values(state);
            for (const callback of callbacks) {
                if (typeof callback !== "function") {
                    continue;
                }
                const result = callbacks(...args);
                if (result) {
                    return result;
                }
            }
        }, [state]);
        return flow;
    };
    return State;
}
