import { useClasses } from "src/Core/Util/Styles";
import styles from "./Maximize.module.scss";
import Screen from "src/UI/Screen";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";
import Resources from "src/Core/UI/Resources";

const resources = {
    MAXIMIZE: {
        eng: "Maximize",
        heb: "הגדל"
    }
};

function Maximize() {
    const lookup = Resources.useLookup();
    const classes = useClasses(styles);
    const actions = Screen.Actions.useState();
    const screen = Screen.State.useState();
    const className = classes({
        root: true,
        focus: screen.focus,
        visible: !screen.maximize && !screen.center && !screen.dock && !screen.fixed && (actions.maximize ?? true)
    });
    const onClick = useCallback(() => {
        screen.maximize = true;
    }, [screen]);
    return <Resources resources={resources} lookup={lookup}>
        <Container>
            <div onClick={onClick} className={className} />
            <Tooltip title={lookup?.MAXIMIZE} enabled={screen.focus} />
        </Container>
    </Resources>;
}

export default Maximize;
