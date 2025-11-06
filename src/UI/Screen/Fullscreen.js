import React, { useCallback } from "react";
import styles from "./Fullscreen.module.scss";
import Screen from "../Screen";
import { useClasses } from "src/Core/Util/Styles";
import Container from "../Util/Container";
import Tooltip from "../Widgets/Tooltip";

export default function Fullscreen() {
    const classes = useClasses(styles);
    const screen = Screen.State.useState();

    const onClick = useCallback(() => {
        screen(state => {
            state.fullscreen = !state.fullscreen;
        });
    }, [screen]);

    const className = classes({
        root: true,
        hidden: screen.fixed || !screen.maximize,
        focus: screen.focus
    });
    const buttonClassName = classes({ button: true });
    return (
        <Container className={className}>
            <div className={buttonClassName} onClick={onClick} />
            <Tooltip title="Fullscreen" enabled={screen.focus} />
        </Container>
    );
}
