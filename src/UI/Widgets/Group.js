import { className } from "src/Core/Util/Styles";
import styles from "./Group.module.scss";

export default function Group({ vertical, children }) {
    const classes = className(styles.root, vertical && styles.vertical);
    return <div className={classes}>
        {children}
    </div>;
}
