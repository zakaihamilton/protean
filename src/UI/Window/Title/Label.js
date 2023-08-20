import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Label.module.scss";
import { withTheme } from "src/UI/Util/Theme";
import Window from "src/UI/Window";
import Drag, { useDrag } from "src/UI/Util/Drag";

function Label() {
    const window = Window.State.useState();
    const ref = useDrag();
    const drag = Drag.useState();
    return (
        <div ref={ref} className={joinClassNames(styles.root, drag.dragging && styles.drag)}>
            {window.label}
        </div>
    )
}

export default withTheme(Label);
