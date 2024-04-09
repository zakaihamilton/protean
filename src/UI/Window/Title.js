import { useClasses } from "src/Core/Util/Styles";
import styles from "./Title.module.scss";
import { withTheme } from "../../Core/UI/Theme";
import Label from "./Title/Label";
import Window from "../Window";
import Minimize from "./Title/Minimize";
import Maximize from "./Title/Maximize";
import Close from "./Title/Close";
import Restore from "./Title/Restore";

function Title({ children }) {
    const classes = useClasses(styles);
    const window = Window.State.useState();
    const className = classes({
        root: true,
        fullscreen: window.fullscreen
    });
    return (
        <div className={className}>
            <div className={styles.separator} />
            <Label />
            {children}
            <div className={styles.separator} />
            <div className={styles.actions}>
                <Close />
                <Minimize />
                <Restore />
                <Maximize />
            </div>
        </div>
    )
}

export default withTheme(Title);
