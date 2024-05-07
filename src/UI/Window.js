import { useMemo } from "react";
import { createState, withState } from "src/Core/Base/State";
import styles from "./Window.module.scss";
import Content from "./Window/Content";
import Title from "./Window/Title";
import Drag from "../Core/UI/Drag";
import Resize from "./Window/Resize";
import { Dock, useDock } from "./Window/Dock";
import { useWindowsItem } from "./Windows";
import Fullscreen from "./Window/Fullscreen";
import { useElement } from "src/Core/Base/Element";
import { useClasses } from "src/Core/Util/Styles";
import Menu from "./Window/Menu";
import { createRegion } from "src/Core/UI/Region";
import { withNode } from "src/Core/Base/Node";

function Window({ children }) {
    const classes = useClasses(styles);
    const rect = Window.Rect.useState();
    const dockStyle = useDock();
    const window = Window.State.useState();
    const min = useMemo(() => ({
        width: window?.min?.width || 200,
        height: window?.min?.height || 200
    }), [window?.min]);
    const ref = useElement();
    useWindowsItem(window, ref?.current, !window?.close);

    const className = classes({
        root: true,
        ...window,
        [window.dock]: window.dock
    });

    const style = useMemo(() => {
        return { ...dockStyle, zIndex: window.index };
    }, [dockStyle, window.index]);

    return (
        <>
            <Drag rect={rect} min={min} />
            <Window.Region target={ref?.current} counter={rect.__counter} />
            <div ref={ref} className={className} style={style}>
                <Title />
                {!window.collapse && <>
                    <Menu />
                    <Content>
                        {children}
                    </Content>
                    <Fullscreen />
                    <Resize />
                </>}
            </div>
        </>
    )
}

Window.Rect = createState("Window.Rect");
Window.Region = createRegion("Window.Region");

export default withNode(withState(Window));
