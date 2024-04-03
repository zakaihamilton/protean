import { withTheme } from "src/Core/UI/Theme";
import styles from "./Item.module.scss";
import { className } from "src/Core/Util/Styles";
import { useCallback, useMemo } from "react";
import { useStateFromObject } from "src/Core/Base/State";

function Item({ item }) {
    const { id, label, focus, minimize } = useStateFromObject(item);
    const style = useMemo(() => {
        return {};
    }, []);
    const onClick = useCallback(() => {
        if (item?.focus) {
            item.minimize = true;
        }
        else {
            item.minimize = false;
            item.focus = true;
        }
    }, [item]);
    const classes = className(styles.root, focus && styles.focus, minimize && styles.minimize);
    return <div id={id} onClick={onClick} className={classes} style={style}>
        <div className={styles.label}>
            {label}
        </div>
    </div>;
}

export default withTheme(Item);
