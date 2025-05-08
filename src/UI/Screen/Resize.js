import { useClasses } from "src/Core/Util/Styles";
import styles from "./Resize.module.scss";
import Drag from "src/Core/UI/Drag";
import { useResizeDrag } from "src/Core/UI/Drag/Resize";
import Screen from "../Screen";

function Resize() {
    const classes = useClasses(styles);
    const drag = Drag.useState();
    const screen = Screen.State.useState();
    const disabled = screen.center || screen.maximize;
    const ref = useResizeDrag(!disabled);
    const className = classes({
        root: true,
        resizing: drag.resizing,
        dock: screen.dock,
        fullscreen: screen.fullscreen,
        maximize: screen.maximize,
        fixed: screen.fixed || screen.center
    });
    return (
        <div ref={ref} className={className}>
            <div className={styles.glyph} />
        </div>
    )
}

export default Resize;
