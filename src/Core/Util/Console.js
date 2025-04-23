
export const consoleMethodNames = ["log", "error", "warn"];

export function createConsole(id) {
    const object = {};
    consoleMethodNames.forEach(methodName => {
        const method = console[methodName];
        if (!method) {
            console.log(`${methodName} is not a console method`);
        }
        object[methodName] = (...args) => {
            return console[methodName](id, ...args);
        };
    });
    return object;
}