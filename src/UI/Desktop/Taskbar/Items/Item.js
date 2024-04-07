import { withTheme } from "src/Core/UI/Theme";
import styles from "./Item.module.scss";
import { useClasses } from "src/Core/Util/Styles";
import { useCallback, useMemo } from "react";
import { useStateFromObject } from "src/Core/Base/State";

function Item({ item }) {
    const classes = useClasses(styles);
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
    const className = classes({
        root: true,
        focus,
        minimize
    });
    return <div id={id} onClick={onClick} className={className} style={style}>
        <div className={styles.label}>
            {label}
        </div>
    </div>;
}

export default withTheme(Item);
