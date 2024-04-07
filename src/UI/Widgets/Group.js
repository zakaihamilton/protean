import { className, useClasses } from "src/Core/Util/Styles";
import styles from "./Group.module.scss";

export default function Group({ vertical, children }) {
    const classes = useClasses(styles);
    const className = classes({
        root: true,
        vertical
    });
    return <div className={className}>
        {children}
    </div>;
}
