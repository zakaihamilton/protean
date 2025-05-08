import { useCallback } from "react";
import Segment from "../Segment";
import styles from "./Collapse.module.scss";
import { useClasses } from "src/Core/Util/Styles";

export default function Collapse() {
    const classes = useClasses(styles);
    const segment = Segment.State.useState();
    const onClick = useCallback(() => {
        segment.collapse = !segment.collapse;
    }, [segment]);
    const className = classes({ root: true, active: segment.collapse });
    return <div className={className} onClick={onClick}>
        -
    </div>;
}
