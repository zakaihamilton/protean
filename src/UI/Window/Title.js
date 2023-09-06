import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Title.module.scss";
import { withTheme } from "../../Core/UI/Theme";
import Label from "./Title/Label";
import Window from "../Window";

function Title({ children }) {
    const window = Window.State.useState();
    return (
        <div className={joinClassNames(styles.root, window?.fullscreen && styles.fullscreen)}>
            <Label />
            {children}
        </div>
    )
}

export default withTheme(Title);
