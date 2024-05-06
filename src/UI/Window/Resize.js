import { useClasses } from "src/Core/Util/Styles";
import styles from "./Resize.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Drag from "src/Core/UI/Drag";
import { useResizeDrag } from "src/Core/UI/Drag/Resize";
import Window from "../Window";

function Resize() {
    const classes = useClasses(styles);
    const drag = Drag.useState();
    const window = Window.State.useState();
    const disabled = window.center || window.maximize;
    const ref = useResizeDrag(!disabled);
    const className = classes({
        root: true,
        resizing: drag.resizing,
        dock: window.dock,
        fullscreen: window.fullscreen,
        maximize: window.maximize,
        fixed: window.fixed || window.center
    });
    return (
        <div ref={ref} className={className}>
            <div className={styles.glyph} />
        </div>
    )
}

export default withTheme(Resize);
