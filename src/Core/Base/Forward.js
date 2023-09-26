export function createForward() {
    const callbacks = [];
    return new Proxy(callbacks, {
        apply(target, thisArg, args) {
            const promises = [];
            for (const callback of target) {
                const result = callback.apply(thisArg, args);
                promises.push(result);
            }
            return Promise.all(promises);
        },
    });
}
