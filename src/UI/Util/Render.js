import React, { useEffect, useRef } from "react";
import { createState } from "src/Core/Base/State";
import Node from "src/Core/Base/Node";

function Render({ children }) {
    const render = Render.State.useState();
    const [isRendered, setRender] = useState();
    const timerRef = useRef();

    const visible = render?.visible;
    useEffect(() => {
        if (visible) {
            timerRef.current = setTimeout(() => {
                setRender(true);
            }, render?.enterTimeout);
        }
        else {
            timerRef.current = setTimeout(() => {
                setRender(false);
            }, render?.exitTimeout);
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
    if (!Component) {
        throw new Error("Component is required");
    }
    const displayName = Component.displayName || Component.name || "";
    const State = Component.Render = createState(displayName + ".Render");
    function WrappedRender({ children, visible, enterTimeout = 0, exitTimeout = 1000, ...props }) {
        return <Node id={displayName}>
            <State visible={visible} enterTimeout={enterTimeout} exitTimeout={exitTimeout} />
            <Render>
                <Component>
                    {children}
                </Component>
            </Render>
        </Node>;
    }
    Object.setPrototypeOf(WrappedRender, Component);
    return WrappedRender;
}
