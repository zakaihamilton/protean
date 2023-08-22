import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Resize.module.scss";
import { withTheme } from "src/UI/Util/Theme";
import Drag, { useResizeDrag } from "src/UI/Util/Drag";
import Window from "../Window";

function Resize() {
    const ref = useResizeDrag();
    const drag = Drag.useState();
    const window = Window.State.useState();
    return (
        <div ref={ref} className={joinClassNames(styles.root, drag.resizing && styles.drag, window.dock && styles.dock)}>
            <div className={styles.glyph} />
        </div>
    )
}

export default withTheme(Resize);
