import React, { useCallback } from "react";
import styles from "./Fullscreen.module.scss";
import Window from "../Window";

export default function Fullscreen() {
    const window = Window.State.useState();

    const onClick = useCallback(() => {
        window.fullscreen = true;
    }, []);

    return <div className={styles.root} onClick={onClick} />;
}
