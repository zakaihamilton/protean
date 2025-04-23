import { useCallback } from "react";
import { createState } from "../Base/State";
const Fetch = createState("Fetch");

export default Fetch;

function useFetch(custom) {
    const fetch = Fetch.useState();
    const handleError = useCallback(async (text, err, ...args) => {
        const error = custom?.error || fetch?.error;
        console.error(text, err, ...args);
        if (error) {
            try {
                const result = await error(...args);
                if (result) {
                    throw new Error(err);
                }
            }
            catch (err) {
                throw new Error(err);
            }
        }
        else {
            throw new Error(err);
        }
    }, [custom, fetch]);

    const retrieve = useCallback(async (url, options, type = "json") => {
        const prepare = custom?.prepare || fetch?.prepare;
        const mapping = custom?.mapping || fetch?.mapping;
        const params = {
            url,
            options,
            type
        };
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
            response = await window.fetch(params?.url, params?.options);
        }
        catch (err) {
            await handleError("Failed to fetch data", err, params, response);
            return;
        }
        /* 3. response */
        let result = null;
        try {
            result = await response[params?.type]();
        }
        catch (err) {
            await handleError("Failed to fetch response", err, params, response);
            return;
        }
        /* 4. mapping */
        if (mapping) {
            try {
                result = await mapping(params, result);
            }
            catch (err) {
                await handleError("Failed to map result", err, params, response);
                return;
            }
        }
        return result;
    }, [custom, handleError, fetch]);

    return retrieve;
}

Fetch.useFetch = useFetch;
