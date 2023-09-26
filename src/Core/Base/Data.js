import { useCallback, useEffect } from "react";
import { withState } from "./State";

export function createData(displayName) {
    function Data({ children }) {
        const state = Data.State.useState();
        const { url, counter, mapping, prepare, error } = state;

        const handleError = useCallback(async (text, ...args) => {
            if (error) {
                try {
                    await error(...args);
                }
                catch (err) {
                    console.error(text, err, ...args);
                }
            }
            else {
                console.error(text, ...args);
            }
            state.loading = false;
        }, [state, error]);

        const retrieve = useCallback(async (params) => {
            state.loading = true;
            /* 1. prepare */
            if (prepare) {
                try {
                    await prepare(params);
                }
                catch (err) {
                    await handleError("Failed to prepare data", err, params);
                    return;
                }
            }
            /* 2. fetch */
            let response = null;
            try {
                response = await fetch(params?.url, params?.options);
            }
            catch (err) {
                await handleError("Failed to fetch data", err, params, response);
                return;
            }
            /* 3. response */
            let result = null;
            try {
                result = await response[params?.type || "json"]();
            }
            catch (err) {
                await handleError("Failed to fetch response", err, params, response);
                return;
            }
            /* 4. mapping */
            if (mapping) {
                try {
                    state.result = await mapping(params, result);
                }
                catch (err) {
                    await handleError("Failed to map result", err, params, response);
                    return;
                }
            }
            else {
                state.result = result;
            }
            state.loading = false;
        }, [handleError, mapping, prepare, state]);

        useEffect(() => {
            retrieve({ ...state });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [url, counter]);

        return children;
    }
    Data.Result = function ({ result }) {
        const state = Data.State.useState();
        const children = result(state.result);
        return children;
    }
    return withState(Data, displayName);
}
