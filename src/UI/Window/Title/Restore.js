import { useClasses } from "src/Core/Util/Styles";
import styles from "./Restore.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";

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
        <Tooltip title="Restore">
            <div onClick={onClick} className={className} />
        </Tooltip>
    )
}

export default withTheme(Restore);
