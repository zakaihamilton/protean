import { useClasses } from "src/Core/Util/Styles";
import styles from "./Maximize.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import { useCallback, useRef } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";

function Maximize() {
    const classes = useClasses(styles);
    const window = Window.State.useState();
    const className = classes({
        root: true,
        focus: window.focus,
        center: window.center,
        dock: window.dock
    });
    const ref = useRef();
    const onClick = useCallback(() => {
        window.maximize = !window.maximize;
    }, [window]);
    return (
        <Tooltip label="Maximize" forRef={ref}>
            <div ref={ref} onClick={onClick} className={className} />
        </Tooltip>
    )
}

export default withTheme(Maximize);
