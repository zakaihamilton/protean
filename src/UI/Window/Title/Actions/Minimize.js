import { useClasses } from "src/Core/Util/Styles";
import styles from "./Minimize.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";

function Minimize() {
    const classes = useClasses(styles);
    const actions = Window.Actions.useState();
    const window = Window.State.useState();
    const className = classes({
        root: true,
        focus: window.focus,
        visible: actions.minimize ?? true
    });
    const onClick = useCallback(() => {
        window.minimize = !window.minimize;
    }, [window]);
    return (
        <Container>
            <div onClick={onClick} className={className} />
            <Tooltip title="Minimize" enabled={window.focus} />
        </Container>
    )
}

export default withTheme(Minimize);
