import { withTheme } from "src/Core/UI/Theme";
import styles from "./Item.module.scss";
import { useClasses } from "src/Core/Util/Styles";
import { useMemo } from "react";
import { useStateFromObject } from "src/Core/Base/State";
import Drag from "src/Core/UI/Drag";
import { useMoveDrag } from "src/Core/UI/Drag/Move";
import { withNode } from "src/Core/Base/Node";
import { DRAG_RANGE, ItemDrag } from "./Item/Drag";
import { useItemPos } from "./Item/Pos";
import { useContainerItem } from "src/UI/Util/Container";
import IconList from "../IconList";

function Item({ item, index }) {
    const { vertical, wrap } = IconList.State.useState();
    const classes = useClasses(styles);
    const { id, label, focus, minimize, icon } = useStateFromObject(item);
    const drag = Drag.useState({ nodeId: null });
    const ref = useMoveDrag(true);
    useContainerItem(index, ref.current);
    const inRange = vertical ?
        (Math.abs(drag?.dragged?.y) > DRAG_RANGE) :
        (Math.abs(drag?.dragged?.x) > DRAG_RANGE);
    const [left, top, target] = useItemPos({ index, vertical, inRange, wrap });
    const style = useMemo(() => {
        return {
            "--left": left + "px",
            "--top": top + "px"
        };
    }, [left, top]);
    const className = classes({
        root: true,
        focus,
        minimize,
        target,
        moving: drag.moving && inRange,
        vertical
    });
    return <div data-index={index} data-id={id} data-label={label} className={className} style={style} ref={ref}>
        <ItemDrag item={item} index={index} vertical={vertical} />
        <div className={styles.icon}>
            {icon}
        </div>
        <div className={styles.label}>
            {label}
        </div>
    </div>;
}

export default withNode(withTheme(Item));
