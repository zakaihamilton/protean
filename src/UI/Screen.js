import { useEffect, useMemo } from "react";
import { createState } from "src/Core/Base/State";
import styles from "./Screen.module.scss";
import Content from "./Screen/Content";
import Title from "./Screen/Title";
import Drag from "../Core/UI/Drag";
import Resize from "./Screen/Resize";
import { useDock } from "./Screen/Dock";
import Fullscreen from "./Screen/Fullscreen";
import { useElement } from "src/Core/UI/Element";
import { useClasses } from "src/Core/Util/Styles";
import Menu from "./Screen/Menu";
import { createRegion } from "src/Core/UI/Region";
import App from "src/Core/UI/Apps/App";
import { create } from "src/Core/Base/Util";
import ScreenManager, { useScreenItem } from "./Screen/Manager";
import { useAnimate } from "src/Core/UI/Animate";

function Screen({ children }) {
    const classes = useClasses(styles);
    const rect = Screen.Rect.useState();
    const dockStyle = useDock();
    const screen = Screen.State.useState();
    const app = App.State.useState();
    const min = useMemo(() => ({
        width: screen?.min?.width || 200,
        height: screen?.min?.height || 200
    }), [screen?.min]);
    const animate = useAnimate(screen?.__counter, 200);
    const ref = useElement();
    useScreenItem(screen, ref?.current);

    const className = classes({
        root: true,
        ...screen,
        [screen.dock]: screen.dock,
        animate
    });

    const style = useMemo(() => {
        return {
            ...dockStyle,
            zIndex: screen.index,
            "--accent-color": screen.assetColor || "darkblue"
        };
    }, [dockStyle, screen.index, screen.assetColor]);

    useEffect(() => {
        if (screen) {
            screen.appId = app?.id;
        }
    }, [app?.id, screen]);

    return (
        <>
            <Drag rect={rect} min={min} />
            <Screen.Region target={ref?.current} counter={rect.__counter} />
            <div ref={ref} className={className} style={style}>
                <Title />
                {!screen.collapse && <>
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

create(Screen, "Screen", {
    Rect: createState,
    Region: createRegion,
    Actions: createState,
    State: createState,
    List: createState
});

Screen.Manager = ScreenManager;

export default Screen;
