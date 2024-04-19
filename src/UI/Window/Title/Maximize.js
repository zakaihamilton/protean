import { useClasses } from "src/Core/Util/Styles";
import styles from "./Maximize.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";

function Maximize() {
    const classes = useClasses(styles);
    const window = Window.State.useState();
    const className = classes({
        root: true,
        focus: window.focus,
        visible: !window.maximize && !window.center && !window.dock && !window.fixed
    });
    const onClick = useCallback(() => {
        window.maximize = true;
    }, [window]);
    return (
        <Container>
            <div onClick={onClick} className={className} />
            <Tooltip title="Maximize" />
        </Container>
    )
}

export default withTheme(Maximize);
