import { useCallback } from "react";
import Screen from "../Screen";
import styles from "./Collapse.module.scss";
import { joinClassNames } from "src/Core/Util/Styles";

export default function Collapse() {
    const screen = Screen.State.useState();
    const onClick = useCallback(() => {
        screen.collapse = !screen.collapse;
    }, [screen]);
    return <div className={joinClassNames(styles.root, screen.collapse && styles.active)} onClick={onClick}>
        -
    </div>;
}
