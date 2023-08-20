import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Resize.module.scss";
import { withTheme } from "src/UI/Util/Theme";
import Drag, { useResizeDrag } from "src/UI/Util/Drag";

function Resize() {
    const ref = useResizeDrag();
    const drag = Drag.useState();
    return (
        <div ref={ref} className={joinClassNames(styles.root, drag.resizing && styles.drag)} />
    )
}

export default withTheme(Resize);
