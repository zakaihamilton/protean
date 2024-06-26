import { useEffect } from "react";
import { createState } from "./State";

export function createEvents(...args) {
    const State = createState(...args);
    State.useEvent = (type, callback, nodeId) => {
        const state = State.useState({ selector: null, nodeId });
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
    State.useListeners = (target, nodeId) => {
        const state = State.useState({ nodeId });
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
    return State;
}
