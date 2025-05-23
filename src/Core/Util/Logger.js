import { useMemo } from "react";
import { createState } from "../Base/State";
import { consoleMethodNames } from "./Console";

function monitor(obj, methodNames, handler) {
    const originals = methodNames.map(method => obj[method]);
    for (let index = 0; index < methodNames.length; index++) {
        const methodName = methodNames[index];
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
        logger.items = [];
        const update = (method, ...args) => {
            const message = args.filter(arg => typeof arg === 'string').join(' ');
            const item = { type: method, message };
            setTimeout(() => {
                logger.items = [...logger.items, item];
            }, 0);
        };
        return monitor(console, consoleMethodNames, update);
    }, [logger]);

    return null;
}

Logger.State = createState("Logger.State");
