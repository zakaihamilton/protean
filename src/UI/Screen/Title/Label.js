import { useClasses } from "src/Core/Util/Styles";
import styles from "./Label.module.scss";
import Screen from "src/UI/Screen";
import Drag from "src/Core/UI/Drag";
import { useMoveDrag } from "src/Core/UI/Drag/Move";
import { useCallback, useMemo } from "react";

function Label() {
    const classes = useClasses(styles);
    const screen = Screen.State.useState();
    const disabled = screen.center || screen.maximize;
    const ref = useMoveDrag(!disabled);
    const drag = Drag.useState();
    const onClick = useCallback(e => {
        if (e.detail === 2 && !disabled) {
            screen.collapse = !screen.collapse;
        }
    }, [screen, disabled]);
    const style = useMemo(() => {
        return {
            "--accent-background": screen.accentBackground || "darkblue",
            "--accent-color": screen.accentColor || "white"
        }
    }, [screen.accentBackground, screen.accentColor]);
    const className = classes(
        {
            root: true,
            moving: drag.moving,
            focus: screen.focus,
            disabled
        }
    );
    return (
        <div ref={ref} className={className} style={style} onClick={onClick}>
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
