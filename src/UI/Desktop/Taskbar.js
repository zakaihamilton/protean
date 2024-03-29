import React, { useCallback } from "react";
import styles from "./Taskbar.module.scss";
import Items from "./Taskbar/Items";
import Windows from "src/UI/Windows";
import { joinClassNames } from "src/Core/Util/Styles";
import { withState } from "src/Core/Base/State";
import { useMonitor } from "src/Core/Base/Monitor";
import { withTheme } from "src/Core/UI/Theme";

function Taskbar() {
    const windows = Windows.State.useState();
    const list = windows.list;
    const state = Taskbar.State.useState();

    const monitor = useCallback(() => {
        const hidden = list.some(item => item.fullscreen && !item.minimize);
        state.visible = !hidden;
    }, [state, list]);

    useMonitor(list, "fullscreen", monitor);

    const className = joinClassNames(styles.root, state?.visible && styles.visible);
    return <div className={className}>
        <Items />
    </div>;
}

export default withTheme(withState(Taskbar));
