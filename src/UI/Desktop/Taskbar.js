import React, { useCallback } from "react";
import styles from "./Taskbar.module.scss";
import Screens from "src/Core/UI/Screens";
import { useClasses } from "src/Core/Util/Styles";
import { useMonitor } from "src/Core/Util/Monitor";
import IconList from "../Widgets/IconList";
import { createState } from "src/Core/Base/State";

function Taskbar() {
    const classes = useClasses(styles);
    const screens = Screens.State.useState();
    const list = screens.list;
    const taskbar = Taskbar.State.useState();

    const monitor = useCallback(() => {
        const hidden = list.some(item => item.fullscreen && !item.minimize && !item.close);
        taskbar.visible = !hidden;
    }, [taskbar, list]);

    useMonitor(list, "fullscreen", monitor);

    const onClick = useCallback(item => {
        screens.forceFocusId = null;
        if (item?.focus) {
            item.minimize = true;
        }
        else {
            item.minimize = false;
            screens.focusId = item?.id;
        }
    }, [screens]);

    const className = classes({ root: true, visible: taskbar?.visible });
    return <div className={className}>
        <IconList.State list={list} onClick={onClick} />
        <IconList />
    </div>;
}

Taskbar.State = createState("Taskbar.State");

export default Taskbar;
