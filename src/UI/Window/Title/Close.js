import { useClasses } from "src/Core/Util/Styles";
import styles from "./Close.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import Window from "src/UI/Window";
import { useCallback } from "react";
import Tooltip from "src/UI/Widgets/Tooltip";

function Close() {
    const classes = useClasses(styles);
    const window = Window.State.useState();
    const className = classes({
        root: true,
        focus: window.focus
    });
    const onClick = useCallback(() => {
        window.close = true;
    }, [window]);
    return (
        <Tooltip title="Close">
            <div onClick={onClick} className={className}>
                <div className={styles.close} />
            </div>
        </Tooltip>
    )
}

export default withTheme(Close);
