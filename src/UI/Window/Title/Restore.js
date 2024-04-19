import { useClasses } from "src/Core/Util/Styles";
import styles from "./Restore.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";

function Restore() {
    const classes = useClasses(styles);
    const window = Window.State.useState();
    const className = classes({
        root: true,
        focus: window.focus,
        visible: window.maximize && !window.center && !window.dock
    });
    const onClick = useCallback(() => {
        window.maximize = false;
    }, [window]);
    return (
        <Container>
            <Tooltip title="Restore" />
            <div onClick={onClick} className={className} />
        </Container>
    )
}

export default withTheme(Restore);
