import { className } from "src/Core/Util/Styles";
import styles from "./Content.module.scss";
import { withTheme } from "../../Core/UI/Theme";

function Content({ children }) {
    return (
        <div className={className(styles.root)}>
            {children}
        </div>
    );
}

export default withTheme(Content);
