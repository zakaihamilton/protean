import { className } from "src/Core/Util/Styles";
import styles from "./Minimize.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import { useCallback } from "react";

function Minimize() {
    const window = Window.State.useState();
    const classes = className(
        styles.root,
        window.focus && styles.focus
    );
    const onClick = useCallback(() => {
        window.minimize = !window.minimize;
    }, [window]);
    return (
        <div onClick={onClick} className={classes} />
    )
}

export default withTheme(Minimize);
