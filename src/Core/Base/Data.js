import { useEffect } from "react";
import { withState } from "./State";
import Fetch from "./Fetch";

export function createData(displayName) {
    function Data({ children }) {
        const state = Data.State.useState();
        const fetch = Fetch.useFetch(state);
        const { url, counter } = state;

        useEffect(() => {
            state.loading = true;
            fetch({ ...state }).then(data => {
                state.result = data;
                state.loading = false;
            }).catch(err => {
                state.error = err;
                state.loading = false;
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [url, counter, state, fetch]);

        return children;
    }
    Data.Result = function DataResult({ result }) {
        const state = Data.State.useState();
        const children = result(state.result);
        return children;
    };
    Data.Wait = function DataWait({ result }) {
        const state = Data.State.useState();
        if (!state.result) {
            return null;
        }
        const children = result(state.result);
        return children;
    }
    return withState(Data, displayName);
}
