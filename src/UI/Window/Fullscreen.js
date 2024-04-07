import React, { useCallback } from "react";
import styles from "./Fullscreen.module.scss";
import Window from "../Window";
import { useClasses } from "src/Core/Util/Styles";

export default function Fullscreen() {
    const classes = useClasses(styles);
    const window = Window.State.useState();

    const onClick = useCallback(() => {
        window.fullscreen = !window.fullscreen;
    }, [window]);

    const className = classes({ root: true, fixed: window.fixed });
    return <div className={className} onClick={onClick} />;
}
