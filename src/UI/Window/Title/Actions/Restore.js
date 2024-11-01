import { useClasses } from "src/Core/Util/Styles";
import styles from "./Restore.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";

function Restore() {
    const classes = useClasses(styles);
    const actions = Window.Actions.useState();
    const window = Window.State.useState();
    const className = classes({
        root: true,
        focus: window.focus,
        visible: window.maximize && !window.center && !window.dock && !window.fixed && (actions.restore ?? true)
    });
    const onClick = useCallback(() => {
        window.maximize = false;
    }, [window]);
    return (
        <Container>
            <div onClick={onClick} className={className} />
            <Tooltip title="Restore" enabled={window.focus} />
        </Container>
    )
}

export default withTheme(Restore);
