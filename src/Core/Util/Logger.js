import { useMemo } from "react";
import { createState } from "../Base/State";
import { consoleMethodNames } from "./Console";

function monitor(obj, methodNames, handler) {
    const originals = methodNames.map(method => obj[method]);
    for (let index = 0; index < methodNames.length; index++) {
        const methodName = methodNames[index];
        if (methodName === "warn") {
            return;
        }
        obj[methodName] = function (...args) {
            const original = originals[index];
            const result = original(...args);
            handler(methodName, ...args);
            return result;
        };
    }
    return () => {
        for (let index = 0; index < methodNames.length; index++) {
            const method = methodNames[index];
            obj[method] = originals[index];
        }
    };
}

export default function Logger() {
    const logger = Logger.State.useState();

    useMemo(() => {
        logger(state => {
            state.items = [];
        });
        const update = (method, ...args) => {
            const message = args.filter(arg => typeof arg === 'string' && !arg.startsWith('\x1B')).join(' ');
            const item = { type: method, message };
            logger(state => {
                state.items = [...state.items, item];
            });
        };
        return monitor(console, consoleMethodNames, update);
    }, [logger]);

    return null;
}

Logger.State = createState("Logger.State");
