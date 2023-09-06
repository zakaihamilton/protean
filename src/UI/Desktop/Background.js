import { withTheme } from "../../Core/UI/Theme";
import styles from "./Background.module.scss";

function Background() {
    return <div className={styles.root} />;
}

export default withTheme(Background);
