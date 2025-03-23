import { useClasses } from "src/Core/Util/Styles";
import styles from "./Title.module.scss";
import Label from "./Title/Label";
import Window from "../Window";
import Actions from "./Title/Actions";

function Title() {
    const classes = useClasses(styles);
    const window = Window.State.useState();
    const className = classes({
        root: true,
        fullscreen: window.fullscreen
    });
    return (
        <div className={className}>
            <Label />
            {!window.collapse && <>
                <div className={styles.separator} />
                <Actions />
            </>}
        </div>
    )
}

export default Title;
