import { useClasses } from "src/Core/Util/Styles";
import styles from "./Close.module.scss";
import Screen from "src/UI/Screen";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";
import Resources from "src/Core/UI/Resources";

const resources = {
    CLOSE: {
        eng: "Close",
        heb: "סגור"
    }
};

function Close() {
    const lookup = Resources.useLookup();
    const classes = useClasses(styles);
    const actions = Screen.Actions.useState();
    const screen = Screen.State.useState();
    const className = classes({
        root: true,
        focus: screen.focus,
        visible: !screen.permanent && (actions.close ?? true)
    });
    const onClick = useCallback(() => {
        screen(state => {
            state.close = true;
        });
    }, [screen]);
    return <Resources resources={resources} lookup={lookup}>
        <Container>
            <div onClick={onClick} className={className}>
                <div className={styles.close} />
            </div>
            <Tooltip title={lookup?.CLOSE} enabled={screen.focus} />
        </Container>
    </Resources>;
}

export default Close;
