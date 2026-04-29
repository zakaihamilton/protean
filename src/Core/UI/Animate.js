import { useEffect, useRef, useState, useMemo } from "react";

export function useAnimate(counter, duration) {
    const [prevCounter, setPrevCounter] = useState(counter);
    const [lastCounter, setLastCounter] = useState(counter);

    if (counter !== lastCounter) {
        setLastCounter(counter);
        if (!duration) {
            setPrevCounter(counter);
        }
    }

    useEffect(() => {
        if (duration && prevCounter !== counter) {
            const timer = setTimeout(() => {
                setPrevCounter(counter);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [counter, duration, prevCounter]);

    const animate = useMemo(() => {
        return !!(duration && prevCounter !== counter);
    }, [counter, prevCounter, duration]);

    return animate;
}