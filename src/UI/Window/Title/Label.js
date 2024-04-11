import { useClasses } from "src/Core/Util/Styles";
import styles from "./Label.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import Drag, { useMoveDrag } from "src/Core/UI/Drag";
import { useMemo } from "react";

function Label() {
    const classes = useClasses(styles);
    const window = Window.State.useState();
    const disabled = window.center || window.maximize;
    const ref = useMoveDrag(!disabled);
    const drag = Drag.useState();
    const style = useMemo(() => {
        return {
            "--accent-background": window.accentBackground || "darkblue",
            "--accent-color": window.accentColor || "white"
        }
    }, [window.accentBackground, window.accentColor]);
    const className = classes(
        {
            root: true,
            moving: drag.moving,
            focus: window.focus,
            disabled
        }
    );
    return (
        <div ref={ref} className={className} style={style}>
            <div className={styles.icon}>
                {window?.icon}
            </div>
            <div className={styles.label}>
                {window?.label}
            </div>
        </div>
    )
}

export default withTheme(Label);
