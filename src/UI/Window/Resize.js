import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Resize.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Drag, { useResizeDrag } from "src/Core/UI/Drag";
import Window from "../Window";

function Resize() {
    const ref = useResizeDrag();
    const drag = Drag.useState();
    const window = Window.State.useState();
    const className = joinClassNames(
        styles.root,
        drag.resizing && styles.drag,
        window.dock && styles.dock,
        window.fullscreen && styles.fullscreen,
        window.fixed && styles.fixed
    );
    return (
        <div ref={ref} className={className}>
            <div className={styles.glyph} />
        </div>
    )
}

export default withTheme(Resize);
