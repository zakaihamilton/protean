import React, { useCallback } from "react";
import styles from "./Fullscreen.module.scss";
import Window from "../Window";
import { useClasses } from "src/Core/Util/Styles";
import Container from "../Util/Container";
import Tooltip from "../Widgets/Tooltip";

export default function Fullscreen() {
    const classes = useClasses(styles);
    const window = Window.State.useState();

    const onClick = useCallback(() => {
        window.fullscreen = !window.fullscreen;
    }, [window]);

    const className = classes({ root: true, hidden: window.fixed || !window.maximize });
    const buttonClassName = classes({ button: true });
    return (
        <Container className={className}>
            <div className={buttonClassName} onClick={onClick} />
            <Tooltip title="Fullscreen" />
        </Container>
    );
}
