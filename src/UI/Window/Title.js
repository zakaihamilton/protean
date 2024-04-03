import { className } from "src/Core/Util/Styles";
import styles from "./Title.module.scss";
import { withTheme } from "../../Core/UI/Theme";
import Label from "./Title/Label";
import Window from "../Window";
import Minimize from "./Title/Minimize";
import Maximize from "./Title/Maximize";

function Title({ children }) {
    const window = Window.State.useState();
    return (
        <div className={className(styles.root, window?.fullscreen && styles.fullscreen)}>
            <div className={styles.separator} />
            <Label />
            {children}
            <div className={styles.separator} />
            <div className={styles.actions}>
                <Minimize />
                <Maximize />
            </div>
        </div>
    )
}

export default withTheme(Title);
