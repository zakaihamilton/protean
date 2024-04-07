import { withState } from "../Core/Base/State";
import { useClasses } from "../Core/Util/Styles";
import styles from "./Screen.module.scss";

function Screen({ children }) {
    const classes = useClasses(styles);
    const state = Screen.State.useState();
    const className = classes({ root: true, collapse: state.collapse });
    return (
        <div className={className}>
            {children}
        </div>
    )
}

export default withState(Screen);
