import { useEffect, useRef } from "react";
import { withExtension } from "src/Core/Base/Extension";

function Render({ children }) {
    const render = Render.State.useState();
    const [isRendered, setRender] = useState();
    const timerRef = useRef();

    const visible = render?.visible;
    useEffect(() => {
        if (visible) {
            timerRef.current = setTimeout(() => {
                setRender(true);
            }, render?.enterTimeout || 0);
        }
        else {
            timerRef.current = setTimeout(() => {
                setRender(false);
            }, render?.exitTimeout || 1000);
        }
        return () => {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        };
    }, [render?.enterTimeout, render?.exitTimeout, visible]);

    if (!isRendered) {
        return null;
    }

    return children;
}

export function withRender(Component) {
    return withExtension(Component, Render, ["visible", "enterTimeout", "exitTimeout"]);
}
