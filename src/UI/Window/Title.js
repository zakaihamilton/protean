import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Title.module.scss";
import { withTheme } from "../Util/Theme";
import Label from "./Title/Label";

function Title({ children }) {
    return (
        <div className={joinClassNames(styles.root)}>
            <Label />
            {children}
        </div>
    )
}

export default withTheme(Title);
