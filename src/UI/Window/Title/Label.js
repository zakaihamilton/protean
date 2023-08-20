import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Label.module.scss";
import { withTheme } from "src/UI/Util/Theme";
import Window from "src/UI/Window";
import Drag, { useMoveDrag } from "src/UI/Util/Drag";

function Label() {
    const window = Window.State.useState();
    const ref = useMoveDrag();
    const drag = Drag.useState();
    return (
        <div ref={ref} className={joinClassNames(styles.root, drag.moving && styles.drag)}>
            {window.label}
        </div>
    )
}

export default withTheme(Label);
