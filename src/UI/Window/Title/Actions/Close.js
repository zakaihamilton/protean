import { useClasses } from "src/Core/Util/Styles";
import styles from "./Close.module.scss";
import Window from "src/UI/Window";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";

function Close() {
    const classes = useClasses(styles);
    const actions = Window.Actions.useState();
    const window = Window.State.useState();
    const className = classes({
        root: true,
        focus: window.focus,
        visible: !window.permanent && (actions.close ?? true)
    });
    const onClick = useCallback(() => {
        window.close = true;
    }, [window]);
    return (
        <Container>
            <div onClick={onClick} className={className}>
                <div className={styles.close} />
            </div>
            <Tooltip title="Close" enabled={window.focus} />
        </Container>
    )
}

export default Close;
