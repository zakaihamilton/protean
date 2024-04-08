import { useClasses } from "src/Core/Util/Styles";
import styles from "./Item.module.scss";
import Menu from "../Menu";
import { useCallback, useMemo } from "react";
import Window from "src/UI/Window";
import Node from "src/Core/Base/Node";

export default function Item({ label, id, items, onClick }) {
    const menu = Menu.State.useState();
    const depth = menu?.depth || 0;
    const window = Window.State.useState();
    const classes = useClasses(styles);
    const selected = menu?.selected?.includes(id);
    const className = classes({ root: true, selected });
    const style = useMemo(() => {
        return {
            "--accent-background": window.accentBackground || "darkblue",
            "--accent-color": window.accentColor || "white"
        }
    }, [window.accentBackground, window.accentColor]);
    const onClickItem = useCallback(() => {
        if (selected) {
            menu.selected = menu.selected.filter(i => i !== id);
        }
        else {
            menu.selected = [...menu.selected || [], id];
        }
        if (onClick) {
            onClick();
        }
    }, [id, menu, onClick, selected]);
    return <div onClick={onClickItem} className={className} style={style}>
        <div className={styles.label}>
            {label}
        </div>
        {!!selected && !!items && <Node>
            <Menu.State visible={selected} items={items} depth={depth + 1} />
        </Node>}
    </div>;
}
