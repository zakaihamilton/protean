import React, { useCallback } from "react";
import styles from "./Taskbar.module.scss";
import Windows from "src/Core/UI/Windows";
import { useClasses } from "src/Core/Util/Styles";
import { useMonitor } from "src/Core/Base/Monitor";
import IconList from "../Widgets/IconList";
import { createState } from "src/Core/Base/State";

function Taskbar() {
    const classes = useClasses(styles);
    const windows = Windows.State.useState();
    const list = windows.list;
    const taskbar = Taskbar.State.useState();

    const monitor = useCallback(() => {
        const hidden = list.some(item => item.fullscreen && !item.minimize && !item.close);
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
            windows.focusId = item?.id;
        }
    }, [windows]);

    const className = classes({ root: true, visible: taskbar?.visible });
    return <div className={className}>
        <IconList.State list={list} onClick={onClick} />
        <IconList />
    </div>;
}

Taskbar.State = createState("Taskbar.State");

export default Taskbar;
