import { className } from "src/Core/Util/Styles";
import styles from "./Label.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import Drag, { useMoveDrag } from "src/Core/UI/Drag";
import { useMemo } from "react";

function Label() {
    const window = Window.State.useState();
    const ref = useMoveDrag();
    const drag = Drag.useState();
    const style = useMemo(() => {
        return {
            "--accent-color": window.accentColor || "darkblue"
        }
    }, [window.accentColor]);
    const classes = className(
        styles.root,
        drag.moving && styles.drag,
        window.focus && styles.focus,
        (window.center || window.maximize) && styles.disabled
    );
    return (
        <div ref={ref} className={classes} style={style}>
            {window?.label}
        </div>
    )
}

export default withTheme(Label);
