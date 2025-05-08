import { useClasses } from "src/Core/Util/Styles";
import styles from "./Close.module.scss";
import Screen from "src/UI/Screen";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";

function Close() {
    const classes = useClasses(styles);
    const actions = Screen.Actions.useState();
    const screen = Screen.State.useState();
    const className = classes({
        root: true,
        focus: screen.focus,
        visible: !screen.permanent && (actions.close ?? true)
    });
    const onClick = useCallback(() => {
        screen.close = true;
    }, [screen]);
    return (
        <Container>
            <div onClick={onClick} className={className}>
                <div className={styles.close} />
            </div>
            <Tooltip title="Close" enabled={screen.focus} />
        </Container>
    )
}

export default Close;
