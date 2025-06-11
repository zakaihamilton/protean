import { useClasses } from "src/Core/Util/Styles";
import styles from "./Title.module.scss";
import Label from "./Title/Label";
import Screen from "../Screen";
import Actions from "./Title/Actions";

function Title() {
    const classes = useClasses(styles);
    const screen = Screen.State.useState();
    const className = classes({
        root: true,
        fullscreen: screen.fullscreen
    });
    return (
        <div className={className}>
            <Label />
            <div className={styles.separator} />
            <Actions />
        </div>
    )
}

export default Title;
