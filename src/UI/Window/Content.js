import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Content.module.scss";
import { withState } from "src/Core/Base/State";

function Content({ children }) {
    const state = Content.State.useState();
    return (
        <div className={joinClassNames(styles.root)}>
            {children}
        </div>
    )
}

export default withState(Content);
