import { createState } from "../Core/Base/State";
import { useClasses } from "../Core/Util/Styles";
import styles from "./Segment.module.scss";

function Segment({ children }) {
    const classes = useClasses(styles);
    const screen = Segment.State.useState();
    const className = classes({ root: true, collapse: screen.collapse });
    return (
        <div className={className}>
            {children}
        </div>
    )
}

Segment.State = createState("Segment.State");

export default Segment;
