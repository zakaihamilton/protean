import { useClasses } from "src/Core/Util/Styles";
import styles from "./Label.module.scss";
import Screen from "src/UI/Screen";
import Drag from "src/Core/UI/Drag";
import { useMoveDrag } from "src/Core/UI/Drag/Move";
import { useCallback, useMemo } from "react";

function Label() {
    const classes = useClasses(styles);
    const screen = Screen.State.useState();
    const dragDisabled = screen.center || screen.maximize;
    const clickDisabled = screen.center || screen.fixed || screen.dock;
    const [, element] = useMoveDrag(!dragDisabled);
    const drag = Drag.useState();
    const onClick = useCallback(e => {
        if (e.detail === 2 && !clickDisabled) {
            screen.maximize = !screen.maximize;
        }
    }, [screen, clickDisabled]);
    const style = useMemo(() => {
        return {
            "--accent-color": screen.assetColor || "darkblue",
            "--accent-text-color": screen.assetTextColor || "white"
        }
    }, [screen.assetColor, screen.assetTextColor]);
    const className = classes(
        {
            root: true,
            moving: drag.moving,
            focus: screen.focus,
            disabled: dragDisabled
        }
    );
    return (
        <div ref={element} className={className} style={style} onClick={onClick}>
            <div className={styles.icon}>
                {screen?.icon}
            </div>
            <div className={styles.label}>
                {screen?.label}
            </div>
        </div>
    )
}

export default Label;
