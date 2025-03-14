import { useClasses } from "src/Core/Util/Styles";
import styles from "./Item.module.scss";
import Menu from "../Menu";
import { useCallback, useMemo } from "react";
import Node from "src/Core/Base/Node";

export default function Item({ label, id, items, onClick, checked, children }) {
    const menu = Menu.State.useState();
    const classes = useClasses(styles);
    const selected = menu?.selected === id;
    const itemClassName = classes({ item: true, selected });
    const labelClassName = classes({ label: true, selected });
    const checkClassName = classes({
        check: true,
        selected,
        checked,
        visible: typeof checked !== "undefined"
    });
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
            menu.selected = null;
        }
        else {
            menu.selected = id;
        }
    }, [id, menu, onClick, selected]);
    const combinedItems = useMemo(() => {
        return [...items || [], ...children || []];
    }, [items, children]);
    return <div className={styles.root}>
        <div className={itemClassName} onClick={onClickItem}>
            <div className={checkClassName} />
            <div className={labelClassName}>
                {label}
            </div>
        </div>
        {!!selected && !!combinedItems?.length && <Node id={id}>
            <Menu.State nodeId={id} visible={selected} items={combinedItems} parent={menu} />
            <Menu />
        </Node>}
    </div>;
}
