import { createState } from "../Core/Base/State";
import { useClasses } from "../Core/Util/Styles";
import styles from "./Screen.module.scss";

function Screen({ children }) {
    const classes = useClasses(styles);
    const screen = Screen.State.useState();
    const className = classes({ root: true, collapse: screen.collapse });
    return (
        <div className={className}>
            {children}
        </div>
    )
}

Screen.State = createState("Screen.State");

export default Screen;
