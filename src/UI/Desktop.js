import { withTheme } from "./Util/Theme";
import Background from "./Desktop/Background";
import Taskbar from "./Desktop/Taskbar";
import styles from "./Desktop.module.scss";

function Desktop() {
    return <div className={styles.root}>
        <Background />
        <Taskbar />
    </div>;
}

export default withTheme(Desktop);
