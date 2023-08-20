import { withState } from "../Core/Base/State";
import { joinClassNames } from "../Core/Util/Styles";
import styles from "./Screen.module.scss";

function Screen({ children }) {
    const state = Screen.State.useState();
    return (
        <div className={joinClassNames(styles.root, state.collapse && styles.collapse)}>
            {children}
        </div>
    )
}

export default withState(Screen);
