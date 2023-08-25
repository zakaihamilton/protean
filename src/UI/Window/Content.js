import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Content.module.scss";
import { withTheme } from "../Util/Theme";

function Content({ children }) {
    return (
        <div className={joinClassNames(styles.root)}>
            {children}
        </div>
    );
}

export default withTheme(Content);
