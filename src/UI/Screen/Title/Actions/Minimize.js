import { useClasses } from "src/Core/Util/Styles";
import styles from "./Minimize.module.scss";
import Screen from "src/UI/Screen";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";

function Minimize() {
    const classes = useClasses(styles);
    const actions = Screen.Actions.useState();
    const screen = Screen.State.useState();
    const className = classes({
        root: true,
        focus: screen.focus,
        visible: actions.minimize ?? true
    });
    const onClick = useCallback(() => {
        screen.minimize = !screen.minimize;
    }, [screen]);
    return (
        <Container>
            <div onClick={onClick} className={className} />
            <Tooltip title="Minimize" enabled={screen.focus} />
        </Container>
    )
}

export default Minimize;
