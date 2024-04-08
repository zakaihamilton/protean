import { useClasses } from "src/Core/Util/Styles";
import styles from "./Item.module.scss";
import Menu from "../Menu";
import { useCallback, useMemo } from "react";
import Window from "src/UI/Window";
import Node from "src/Core/Base/Node";

export default function Item({ label, id, items, onClick, check }) {
    const menu = Menu.State.useState();
    const window = Window.State.useState();
    const classes = useClasses(styles);
    const selected = menu?.selected?.includes(id);
    const itemClassName = classes({ item: true, selected });
    const labelClassName = classes({ label: true, selected });
    const checkClassName = classes({ check: true, selected, checked: check, visible: typeof check !== "undefined" });
    const style = useMemo(() => {
        return {
            "--accent-background": window.accentBackground || "darkblue",
            "--accent-color": window.accentColor || "white"
        }
    }, [window.accentBackground, window.accentColor]);
    const onClickItem = useCallback(() => {
        let close = false;
        if (onClick) {
            close = onClick();
        }
        if (close) {
            let parent = menu;
            for (; ;) {
                parent = parent.parent;
                if (!parent) {
                    break;
                }
                parent.selected = [];
            }
            return;
        }
        if (selected) {
            menu.selected = menu.selected.filter(i => i !== id);
        }
        else {
            menu.selected = [...menu.selected || [], id];
        }
    }, [id, menu, onClick, selected]);
    return <div className={styles.root}>
        <div className={itemClassName} style={style} onClick={onClickItem}>
            <div className={checkClassName} />
            <div className={labelClassName}>
                {label}
            </div>
        </div>
        {!!selected && !!items && <Node id={id}>
            <Menu.State nodeId={id} visible={selected} items={items} parent={menu} />
            <Menu />
        </Node>}
    </div>;
}
