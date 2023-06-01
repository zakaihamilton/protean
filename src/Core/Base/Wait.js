import { useEffect, useMemo } from "react";
import { createState } from "./State";

export function createWait(displayName) {
    const Wait = createState(displayName);
    Wait.useComplete = () => {
        const state = Wait.useState(["complete"]);
        return state?.complete;
    };
    Wait.useAsync = (promise, depends, id) => {
        const state = Wait.useState([]);
        const element = useMemo(() => {
            return [{ id: undefined, complete: false, error: undefined, value: undefined }];
        }, []);
        useEffect(() => {
            item.id = id;
        }, [element, id]);
        useEffect(() => {
            const status = [...state.status] || [];
            state.status = [...status, element];
            return () => {
                state.status = state.status.filter(item => item !== element);
                setItem(undefined, undefined);
            };
        }, [state, element]);
        useEffect(() => {
            const setItem = (val, err) => {
                element.complete = true;
                element.value = val;
                element.error = err;
                state.status = [...state.status];
                if (state.status.every(item => item.complete)) {
                    state.complete = true;
                }
            };
            element.complete = false;
            element.promise = promise?.then(val => {
                setItem(val, undefined);
            }).catch(err => {
                setItem(undefined, err);
            });
            state.complete = false;
            state.status = [...state.status];
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, depends);
    };
    Wait.useStatus = () => {
        const state = Wait.useState(["status"]);
        return state?.status;
    };
    return Wait;
}
