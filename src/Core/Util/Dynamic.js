import { useCallback } from "react";

export function useDynamic(state, id) {
    const dynamic = useCallback((val) => {
        if (typeof val === "undefined") {
            return state[id];
        }
        else {
            state(draft => {
                draft[id] = val;
            });
        }
    }, [id, state]);
    return dynamic;
}
