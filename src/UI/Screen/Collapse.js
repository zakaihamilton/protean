import { useCallback } from "react";
import Screen from "../Screen";
import styles from "./Collapse.module.scss";
import { useClasses } from "src/Core/Util/Styles";

export default function Collapse() {
    const classes = useClasses(styles);
    const screen = Screen.State.useState();
    const onClick = useCallback(() => {
        screen.collapse = !screen.collapse;
    }, [screen]);
    const className = classes({ root: true, active: screen.collapse });
    return <div className={className} onClick={onClick}>
        -
    </div>;
}
