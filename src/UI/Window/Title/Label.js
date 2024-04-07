import { useClasses } from "src/Core/Util/Styles";
import styles from "./Label.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import Drag, { useMoveDrag } from "src/Core/UI/Drag";
import { useMemo } from "react";

function Label() {
    const classes = useClasses(styles);
    const window = Window.State.useState();
    const ref = useMoveDrag();
    const drag = Drag.useState();
    const style = useMemo(() => {
        return {
            "--accent-color": window.accentColor || "darkblue"
        }
    }, [window.accentColor]);
    const className = classes(
        {
            root: true,
            moving: drag.moving,
            focus: window.focus,
            disabled: window.center || window.maximize
        }
    );
    return (
        <div ref={ref} className={className} style={style}>
            {window?.label}
        </div>
    )
}

export default withTheme(Label);
