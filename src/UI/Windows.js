import { useCallback, useEffect } from "react";
import { withState } from "src/Core/Base/State";

function Windows({ children }) {
    return children;
}

export function useWindowsItem(window, ref) {
    const windows = Windows.State.useState();

    useEffect(() => {
        if (!windows.list) {
            windows.list = [];
        }
        if (!windows.focus) {
            windows.focus = [];
        }
        windows.list.push(window);
        window.focus = true;
        return () => {
            windows.list = windows.list.filter(item => item !== window);
            windows.focus = windows.focus.filter(item => item !== window);
            window.focus = false;
        }
    }, [window, windows]);

    useEffect(() => {
        const target = ref?.current;
        if (!target || !window) {
            return;
        }
        const focus = (val) => {
            if (val) {
                window.minimize = false;
                windows.focus = [...windows.focus.filter(item => item !== window), window].filter(Boolean);
            }
            else {
                const last = windows.focus[windows.focus.length - 1];
                windows.focus = [...windows.focus.filter(item => item !== last), last].filter(Boolean);
            }
            windows.focus.forEach((item, index) => {
                item.index = index;
            });
        };
        const minimize = (val) => {
            window.focus = !val;
            if (val) {
                windows.focus = windows.focus.filter(item => item !== window);
            }
        };
        window.__monitor("focus", focus);
        window.__monitor("minimize", minimize);
        const handleMouseDown = () => {
            window.focus = true;
        };
        target.addEventListener("mousedown", handleMouseDown);
        return () => {
            window.__unmonitor("focus", focus);
            window.__unmonitor("minimize", minimize);
            target.removeEventListener("mousedown", handleMouseDown);
        }
    }, [ref, window, windows]);
}

export default withState(Windows);
