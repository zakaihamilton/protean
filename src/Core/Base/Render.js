import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * A custom hook that provides a function to trigger a re-render,
 * automatically batching multiple calls within a single microtask cycle.
 * This ensures that even if the returned function is called multiple times
 * synchronously or within the same event loop tick, the component
 * only re-renders once.
 *
 * @returns {function} A function that requests a batched re-render.
 */
export function useBatchedRender() {
    // Internal state used solely to trigger re-renders.
    const [, setCounter] = useState(0);

    // Ref to track if an update has already been scheduled for the current microtask cycle.
    const isUpdateScheduledRef = useRef(false);

    // Store the state setter in a ref to avoid including it in useCallback dependencies,
    // ensuring the returned function's identity remains stable.
    const setCounterRef = useRef(setCounter);
    useEffect(() => {
        setCounterRef.current = setCounter;
    }, [setCounter]);

    // The function returned to the component to request a render.
    const requestRender = useCallback(() => {
        // Only schedule an update if one isn't already pending in this microtask cycle.
        if (!isUpdateScheduledRef.current) {
            isUpdateScheduledRef.current = true;

            // Define the function that performs the state update and resets the flag.
            const performUpdate = () => {
                // Use the functional update form to ensure state updates correctly even if called rapidly.
                setCounterRef.current(count => count + 1);
                // Reset the flag after the update has been processed, allowing future updates.
                isUpdateScheduledRef.current = false;
            };

            // Schedule the update function to run in the microtask queue.
            // This delays the execution until after the current synchronous code block finishes.
            if (typeof queueMicrotask === 'function') {
                queueMicrotask(performUpdate);
            } else {
                // Fallback for environments without queueMicrotask (e.g., older browsers)
                Promise.resolve().then(performUpdate);
            }
        }
        // Dependency array is empty because we access mutable refs (setCounterRef, isUpdateScheduledRef).
        // This ensures the requestRender function reference remains stable across renders.
    }, []);

    // Return the function that the component will call to trigger a batched re-render.
    return requestRender;
}
