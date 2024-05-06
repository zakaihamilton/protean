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

function Item({ item, index, vertical }) {
    const classes = useClasses(styles);
    const { label, focus, minimize, icon } = useStateFromObject(item);
    const drag = Drag.useState(undefined, null);
    const ref = useMoveDrag(true);
    const [left, top, itemStyles] = useItemPos({ index, vertical, ref });
    const inRange = vertical ?
        (Math.abs(drag?.dragged?.y) > DRAG_RANGE) :
        (Math.abs(drag?.dragged?.x) > DRAG_RANGE);
    const style = useMemo(() => {
        if (vertical) {
            return {
                "--top": top + "px",
                ...itemStyles
            };
        }
        else {
            return {
                "--left": left + "px",
                ...itemStyles
            };
        }
    }, [left, top, vertical, itemStyles]);
    const className = classes({
        root: true,
        focus,
        minimize,
        moving: drag.moving && inRange,
        vertical
    });
    return <div data-index={index} data-label={label} className={className} style={style} ref={ref}>
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
