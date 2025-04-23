import { useEffect } from "react";
import { createState } from "./Base/State";
import Fetch from "./Base/Fetch";

export function createData(displayName) {
    function Data({ children }) {
        const data = Data.State.useState();
        const fetch = Fetch.useFetch(data);
        const { url, counter } = data;

        useEffect(() => {
            data.loading = true;
            fetch({ ...data }).then(result => {
                data.result = result;
                data.loading = false;
            }).catch(err => {
                data.error = err;
                data.loading = false;
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [url, counter, data, fetch]);

        return children;
    }
    Data.Result = function DataResult({ result }) {
        const data = Data.State.useState();
        const children = result(data.result);
        return children;
    };
    Data.Wait = function DataWait({ result }) {
        const data = Data.State.useState();
        if (!data.result) {
            return null;
        }
        const children = result(data.result);
        return children;
    }
    Data.State = createState(displayName + ".State");
    return Data;
}
