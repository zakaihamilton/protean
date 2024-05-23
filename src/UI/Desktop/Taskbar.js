import React, { useCallback, useEffect } from "react";
import styles from "./Taskbar.module.scss";
import Items from "./Taskbar/Items";
import Windows from "src/Core/UI/Windows";
import { useClasses } from "src/Core/Util/Styles";
import { withState } from "src/Core/Base/State";
import { useMonitor } from "src/Core/Base/Monitor";
import { withTheme } from "src/Core/UI/Theme";
import { withNode } from "src/Core/Base/Node";

function Taskbar() {
    const classes = useClasses(styles);
    const windows = Windows.State.useState();
    const list = windows.list;
    const state = Taskbar.State.useState();

    const monitor = useCallback(() => {
        const hidden = list.some(item => item.fullscreen && !item.minimize);
        state.visible = !hidden;
    }, [state, list]);

    useMonitor(list, "fullscreen", monitor);

    const className = classes({ root: true, visible: state?.visible });
    return <div className={className}>
        <Items list={list} />
    </div>;
}

export default withTheme(withNode(withState(Taskbar)));
