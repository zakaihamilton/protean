import { useEffect } from 'react';
import Fetch from './Base/Fetch';
import { createState } from './Base/State';

export function createData(displayName) {
  function Data({ children }) {
    const data = Data.State.useState();
    const fetch = Fetch.useFetch(data);

    useEffect(() => {
      data((state) => {
        state.loading = true;
      });
      fetch({ ...data })
        .then((result) => {
          data((state) => {
            state.result = result;
            state.loading = false;
          });
        })
        .catch((err) => {
          data((state) => {
            state.error = err;
            state.loading = false;
          });
        });
    }, [data, fetch]);

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
  };
  Data.State = createState(`${displayName}.State`);
  return Data;
}
