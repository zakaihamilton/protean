import React, {useMemo} from "react";
import { withTheme } from "../Util/Theme";
import styles from "./Taskbar.module.scss";
import Items from "./Taskbar/Items";
import Windows from "src/UI/Windows";
import { joinClassNames } from "src/Core/Util/Styles";

function Taskbar() {
    const windows = Windows.State.useState();
    const list = windows.list;

    const visible = useMemo(() => {
        const hasFullscreen = list?.some(item => item?.fullscreen);
        return !hasFullscreen;
    }, [list]);

    return <div className={joinClassNames(styles.root, visible && styles.visible)}>
        <Items />
    </div>;
}

export default withTheme(Taskbar);
