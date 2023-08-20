import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Group.module.scss";

export default function Group({ vertical, children }) {
    const className = joinClassNames(styles.root, vertical && styles.vertical);
    return <div className={className}>
        {children}
    </div>;
}
