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
        const updateFocus = () => {
            const focused = windows.focus[windows.focus.length - 1];
            windows.focus.forEach((item, index) => {
                item.focus = window === focused;
                item.index = index;
            });
        };
        const focus = (val) => {
            console.log("focus", val);
            if (val) {
                window.minimize = false;
                windows.focus = [...windows.focus.filter(item => item !== window), window].filter(Boolean);
            }
            else {
                const last = windows.focus[windows.focus.length - 1];
                windows.focus = [...windows.focus.filter(item => item !== last), last].filter(Boolean);
            }
            updateFocus();
        };
        const minimize = (val) => {
            console.log("minimize", val);
            window.focus = !val;
            if (val) {
                windows.focus = windows.focus.filter(item => item !== window);
            }
        };
        window.__monitor("focus", focus);
        window.__monitor("minimize", minimize);
        updateFocus();
        const handleMouseDown = () => {
            console.log("handleMouseDown", window);
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
