import { useMemo } from "react";
import { createState, withState } from "../Core/Base/State";
import { joinClassNames } from "../Core/Util/Styles";
import styles from "./Window.module.scss";
import Content from "./Window/Content";
import Title from "./Window/Title";
import Drag from "./Util/Drag";
import Resize from "./Window/Resize";
import { Dock, useDock } from "./Window/Dock";
import { useWindowsItem } from "./Windows";
import Fullscreen from "./Window/Fullscreen";
import { useElement } from "src/Core/Base/Element";

function Window({ children }) {
    const region = Window.Region.useState();
    const dockStyle = useDock();
    const window = Window.State.useState();
    const min = useMemo(() => ({
        width: window?.min?.width || 150,
        height: window?.min?.height || 150
    }), [window?.min]);
    const ref = useElement();
    useWindowsItem(window, ref?.current);

    const className = joinClassNames(
        styles.root,
        window?.minimize && styles.minimize,
        window?.fullscreen && styles.fullscreen,
        window?.focus && styles.focus);

    const style = useMemo(() => {
        return { ...dockStyle, zIndex: window.index };
    }, [dockStyle, window.index]);

    return (
        <>
            <Drag region={region} min={min} />
            <Dock />
            <div ref={ref} className={className} style={style}>
                <Title />
                <Fullscreen />
                <Content>
                    {children}
                </Content>
                <Resize />
            </div>
        </>
    )
}

Window.Region = createState("Window.Region");

export default withState(Window);
