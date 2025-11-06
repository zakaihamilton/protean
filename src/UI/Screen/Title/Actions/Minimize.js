import { useClasses } from "src/Core/Util/Styles";
import styles from "./Minimize.module.scss";
import Screen from "src/UI/Screen";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";
import Resources from "src/Core/UI/Resources";

const resources = {
    MINIMIZE: {
        eng: "Minimize",
        heb: "מזער"
    }
};

function Minimize() {
    const lookup = Resources.useLookup();
    const classes = useClasses(styles);
    const actions = Screen.Actions.useState();
    const screen = Screen.State.useState();
    const className = classes({
        root: true,
        focus: screen.focus,
        visible: actions.minimize ?? true
    });
    const onClick = useCallback(() => {
        screen(state => {
            state.minimize = !state.minimize;
        });
    }, [screen]);
    return <Resources resources={resources} lookup={lookup}>
        <Container>
            <div onClick={onClick} className={className} />
            <Tooltip title={lookup?.MINIMIZE} enabled={screen.focus} />
        </Container>
    </Resources>;
}

export default Minimize;
