import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Maximize.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import { useCallback } from "react";

function Maximize() {
    const window = Window.State.useState();
    const className = joinClassNames(
        styles.root,
        window.focus && styles.focus,
        window.center && styles.center,
        window.dock && styles.dock
    );
    const onClick = useCallback(() => {
        window.maximize = !window.maximize;
    }, [window]);
    return (
        <div onClick={onClick} className={className} />
    )
}

export default withTheme(Maximize);
