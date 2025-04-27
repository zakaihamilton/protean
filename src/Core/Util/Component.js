import { useEffect, useRef, useState } from 'react';

const components = new Map();

/**
 * React hook that runs an effect callback:
 * 1. Once when the first instance of a component type mounts.
 * 2. Again if the dependencies change on the first instance.
 * It runs the associated cleanup function only when the last instance of that
 * component type unmounts OR just before the effect runs again due to dependency changes.
 *
 * @param {any} key - A unique key identifying the component type.
 * Often, you can pass the component function itself (e.g., `MyComponent`).
 * Must be consistent across all instances of the component.
 * @param {() => (void | (() => void))} callback - The function to run.
 * It can optionally return a cleanup function.
 * @param {any[] | undefined} [dependencies] - Optional dependency array. If provided,
 * the effect (cleanup + callback) will re-run if these dependencies change
 * while instances are mounted. If omitted, the effect runs only on first mount.
 */
export function useComponentEffect(key, callback, dependencies = []) {
    const callbackRef = useRef(callback);
    const [instanceId] = useState(() => Symbol());

    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => {
        let component = components.get(key);

        if (!component) {
            component = {
                key,
                instances: []
            };
            components.set(key, component);
        }

        const exists = component.instances.find(item => item === instanceId);
        if (!exists) {
            component.instances.push(instanceId);
            if (component.instances.length > 1) {
                return;
            }
        }

        if (component.cleanup) {
            component.cleanup();
            component.cleanup = null;
        }

        const cleanup = callbackRef.current();
        if (typeof cleanup === 'function') {
            component.cleanup = cleanup;
        } else {
            component.cleanup = null;
        }
        return () => {
            component.instances = component.instances.filter(item => item !== instanceId);
            if (component.instances.length) {
                return;
            }
            if (component.cleanup) {
                component.cleanup();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, instanceId, ...dependencies]);
}
