import React, { useCallback } from "react";
import styles from "./Fullscreen.module.scss";
import Window from "../Window";
import { className } from "src/Core/Util/Styles";

export default function Fullscreen() {
    const window = Window.State.useState();

    const onClick = useCallback(() => {
        window.fullscreen = !window.fullscreen;
    }, [window]);

    const classes = className(styles.root, window.fixed && styles.fixed);
    return <div className={classes} onClick={onClick} />;
}
