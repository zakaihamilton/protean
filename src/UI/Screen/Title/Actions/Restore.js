import { useClasses } from "src/Core/Util/Styles";
import styles from "./Restore.module.scss";
import Screen from "src/UI/Screen";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";

function Restore() {
    const classes = useClasses(styles);
    const actions = Screen.Actions.useState();
    const screen = Screen.State.useState();
    const className = classes({
        root: true,
        focus: screen.focus,
        visible: screen.maximize && !screen.center && !screen.dock && !screen.fixed && (actions.restore ?? true)
    });
    const onClick = useCallback(() => {
        screen.maximize = false;
    }, [screen]);
    return (
        <Container>
            <div onClick={onClick} className={className} />
            <Tooltip title="Restore" enabled={screen.focus} />
        </Container>
    )
}

export default Restore;
