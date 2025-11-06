import React, { useCallback } from "react";
import styles from "./Taskbar.module.scss";
import { useClasses } from "src/Core/Util/Styles";
import { useMonitor } from "src/Core/Util/Monitor";
import IconList from "../Widgets/IconList";
import { createState } from "src/Core/Base/State";
import Screen from "src/UI/Screen";

function Taskbar() {
    const classes = useClasses(styles);
    const screenManager = Screen.Manager.useManager();
    const list = screenManager.list;
    const taskbar = Taskbar.State.useState();

    const monitor = useCallback(() => {
        const hidden = list.some(item => item.fullscreen && !item.minimize && !item.close);
        taskbar(state => {
            state.visible = !hidden;
        });
    }, [taskbar, list]);

    useMonitor(list, "fullscreen", monitor);

    const onClick = useCallback(item => {
        screenManager(state => {
            state.forceFocusId = null;
            if (item?.focus) {
                item.minimize = true;
            } else {
                item.minimize = false;
                state.focusId = item?.id;
            }
        });
    }, [screenManager]);

    const className = classes({ root: true, visible: taskbar?.visible });
    return <div className={className}>
        <IconList.State list={list} onClick={onClick} />
        <IconList />
    </div>;
}

Taskbar.State = createState("Taskbar.State");

export default Taskbar;
