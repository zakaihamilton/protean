import { useEffect, useRef, useState, useMemo } from "react";

export function useAnimate(counter, duration) {
    const [tick, setTick] = useState(0);
    const prevCounterRef = useRef(counter);

    useEffect(() => {
        if (!duration) {
            return;
        }
        if (prevCounterRef.current !== counter) {
            const timer = setTimeout(() => {
                prevCounterRef.current = counter;
                setTick(t => t + 1);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [counter, duration]);

    const animate = useMemo(() => {
        return duration && prevCounterRef.current !== counter;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter, tick, duration]);

    return animate;
}