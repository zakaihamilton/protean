import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Label.module.scss";
import { withTheme } from "src/UI/Util/Theme";
import Window from "src/UI/Window";
import Drag, { useMoveDrag } from "src/UI/Util/Drag";
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
    return (
        <div ref={ref} className={joinClassNames(styles.root, drag.moving && styles.drag, window.focus && styles.focus)} style={style}>
            {window?.label}
        </div>
    )
}

export default withTheme(Label);
