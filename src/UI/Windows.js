import { useEffect } from "react";
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
        windows.list.push(window);
        return () => {
            windows.list = windows.list.filter(item => item !== window);
        }
    }, [window, windows]);

    useEffect(() => {
        const target = ref?.current;
        if (!target || !window) {
            return;
        }
        const handleMouseDown = (e) => {
            windows.list = [...windows.list.filter(item => item !== window), window];
            windows.list.forEach((item, index) => {
                item.focus = item === window;
                item.index = index;
            });
        };
        target.addEventListener("mousedown", handleMouseDown);
        return () => {
            target.removeEventListener("mousedown", handleMouseDown);
        }
    }, [ref, window, windows, windows.list]);
}

export default withState(Windows);
