import React, { useCallback } from "react";
import styles from "./Taskbar.module.scss";
import Windows from "src/Core/UI/Windows";
import { useClasses } from "src/Core/Util/Styles";
import { withState } from "src/Core/Base/State";
import { useMonitor } from "src/Core/Base/Monitor";
import { withTheme } from "src/Core/UI/Theme";
import { withNode } from "src/Core/Base/Node";
import IconList from "../Widgets/IconList";

function Taskbar() {
    const classes = useClasses(styles);
    const windows = Windows.State.useState();
    const list = windows.list;
    const taskbar = Taskbar.State.useState();

    const monitor = useCallback(() => {
        const hidden = list.some(item => item.fullscreen && !item.minimize);
        taskbar.visible = !hidden;
    }, [taskbar, list]);

    useMonitor(list, "fullscreen", monitor);

    const onClick = useCallback(item => {
        windows.forceFocusId = null;
        if (item?.focus) {
            item.minimize = true;
        }
        else {
            item.minimize = false;
            windows.updateFocus(item?.id);
        }
    }, [windows]);

    const className = classes({ root: true, visible: taskbar?.visible });
    return <div className={className}>
        <IconList list={list} onClick={onClick} />
    </div>;
}

export default withTheme(withNode(withState(Taskbar)));
