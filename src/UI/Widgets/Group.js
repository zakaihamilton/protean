import { useClasses } from "src/Core/Util/Styles";
import styles from "./Group.module.scss";
import { withTheme } from "src/Core/UI/Theme";

function Group({ vertical, wrap, flex, children }) {
    const classes = useClasses(styles);
    const className = classes({
        root: true,
        vertical,
        wrap,
        flex
    });
    return <div className={className}>
        {children}
    </div>;
}

export default withTheme(Group);
