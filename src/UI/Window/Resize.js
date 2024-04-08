import { useClasses } from "src/Core/Util/Styles";
import styles from "./Resize.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Drag, { useResizeDrag } from "src/Core/UI/Drag";
import Window from "../Window";

function Resize() {
    const classes = useClasses(styles);
    const ref = useResizeDrag();
    const drag = Drag.useState();
    const window = Window.State.useState();
    const className = classes({
        root: true,
        resizing: drag.resizing,
        dock: window.dock,
        fullscreen: window.fullscreen,
        fixed: window.fixed || window.center
    });
    return (
        <div ref={ref} className={className}>
            <div className={styles.glyph} />
        </div>
    )
}

export default withTheme(Resize);
