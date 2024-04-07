import { useClasses } from "src/Core/Util/Styles";
import styles from "./Minimize.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import { useCallback, useRef } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";

function Minimize() {
    const classes = useClasses(styles);
    const window = Window.State.useState();
    const className = classes({
        root: true,
        focus: window.focus
    });
    const ref = useRef();
    const onClick = useCallback(() => {
        window.minimize = !window.minimize;
    }, [window]);
    return (
        <Tooltip label="Minimize" forRef={ref}>
            <div ref={ref} onClick={onClick} className={className} />
        </Tooltip>
    )
}

export default withTheme(Minimize);
