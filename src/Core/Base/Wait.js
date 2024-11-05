import { useCallback, useEffect, useMemo } from "react";
import { createState } from "./State";

export function createWait(displayName) {
    const Wait = createState(displayName);
    Wait.useComplete = () => {
        const wait = Wait.useState({ selector: ["complete"] });
        return wait?.complete;
    };
    Wait.useAsync = (promise, depends, id) => {
        const wait = Wait.useState({ selector: null });
        const element = useMemo(() => {
            return [{ id: undefined, complete: false, error: undefined, value: undefined }];
        }, []);
        useEffect(() => {
            element.id = id;
        }, [element, id]);
        const setItem = useCallback((val, err) => {
            element.complete = true;
            element.value = val;
            element.error = err;
            wait.status = [...wait.status];
            if (wait.status.every(item => item.complete)) {
                wait.complete = true;
            }
        }, [wait, element]);
        useEffect(() => {
            const status = [...wait.status] || [];
            wait.status = [...status, element];
            return () => {
                wait.status = wait.status.filter(item => item !== element);
                setItem(undefined, undefined);
            };
        }, [wait, element, setItem]);
        useEffect(() => {
            element.complete = false;
            element.promise = promise?.then(val => {
                setItem(val, undefined);
            }).catch(err => {
                setItem(undefined, err);
            });
            wait.complete = false;
            wait.status = [...wait.status];
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, depends);
    };
    Wait.useStatus = () => {
        const wait = Wait.useState({ selector: ["status"] });
        return wait?.status;
    };
    return Wait;
}
