import { withTheme } from "../Util/Theme";
import styles from "./Taskbar.module.scss";
import Items from "./Taskbar/Items";

function Taskbar() {
    return <div className={styles.root}>
        <Items />
    </div>;
}

export default withTheme(Taskbar);
