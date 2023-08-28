import React, {useMemo, useCallback} from "react";
import { withTheme } from "../Util/Theme";
import styles from "./Taskbar.module.scss";
import Items from "./Taskbar/Items";
import Windows from "src/UI/Windows";
import { joinClassNames } from "src/Core/Util/Styles";
import { withState } from "src/Core/Base/State";

function Taskbar() {
    const windows = Windows.State.useState();
    const list = windows.list;
    const state = Taskbar.State.useState();

    const monitor = useCallback((_method, target, key, value) => {
        if(key === "fullscreen") {
            if(value) {
                state.visible = false;
            }
            else {
                state.visible = true;
            }
        }
    }, []);

    useMonitor(list, monitor);

    return <div className={joinClassNames(styles.root, state?.visible && styles.visible)}>
        <Items />
    </div>;
}

export default withTheme(withState(Taskbar));
