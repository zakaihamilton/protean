import { useMemo, useRef } from "react";
import { withState } from "../Core/Base/State";
import { joinClassNames } from "../Core/Util/Styles";
import styles from "./Window.module.scss";
import Content from "./Window/Content";
import Title from "./Window/Title";
import Drag from "./Util/Drag";
import Region from "./Util/Region";
import Resize from "./Window/Resize";
import { Dock, useDock } from "./Window/Dock";
import { useWindowsItem } from "./Windows";

function Window({ children }) {
    const region = Region.useState();
    const dockStyle = useDock();
    const min = useMemo(() => ({ width: 150, height: 150 }), []);
    const window = Window.State.useState();
    const ref = useRef();
    useWindowsItem(window, ref);

    const style = useMemo(() => {
        return { ...dockStyle, zIndex: window.index };
    }, [dockStyle, window.index]);

    return (
        <>
            <Drag region={region} min={min} />
            <Dock />
            <div ref={ref} className={joinClassNames(styles.root)} style={style}>
                <Title />
                <Content>
                    {children}
                </Content>
                <Resize />
            </div>
        </>
    )
}

export default withState(Window);
