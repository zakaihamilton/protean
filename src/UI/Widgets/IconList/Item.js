import styles from "./Item.module.scss";
import { useClasses } from "src/Core/Util/Styles";
import { useMemo } from "react";
import { useObjectState } from "src/Core/Base/State";
import Drag from "src/Core/UI/Drag";
import { useMoveDrag } from "src/Core/UI/Drag/Move";
import { DRAG_RANGE, ItemDrag } from "./Item/Drag";
import { useItemPos } from "./Item/Pos";
import { useContainerItem } from "src/UI/Util/Container";
import IconList from "../IconList";
import { IconContext } from "react-icons";
import Lang from "src/Core/UI/Lang";

function Item({ item, index }) {
    const lang = Lang.State.useState();
    const { vertical = false, wrap, layout } = IconList.State.useState();
    const classes = useClasses(styles);
    const { id, label, focus, minimize, icon } = useObjectState(item) || {};
    const drag = Drag.useState(null, {});
    const ref = useMoveDrag(true, { horizontalLock: vertical, verticalLock: !vertical });
    const [mounted] = useContainerItem(index, ref.current);
    let inRange = false;
    if (layout === "big-icons") {
        inRange = (Math.abs(drag?.dragged?.x) > DRAG_RANGE || Math.abs(drag?.dragged?.y) > DRAG_RANGE);
    }
    else if (vertical) {
        inRange = (Math.abs(drag?.dragged?.y) > DRAG_RANGE);
    }
    else {
        inRange = (Math.abs(drag?.dragged?.x) > DRAG_RANGE);
    }
    const [left, top, target] = useItemPos({ index, vertical, inRange, wrap, direction: lang?.direction });
    const style = useMemo(() => {
        return {
            "--left": left + "px",
            "--top": top + "px"
        };
    }, [left, top]);
    const absolute = mounted;
    const className = classes({
        root: true,
        focus,
        minimize,
        target,
        moving: drag.moving && inRange,
        vertical,
        absolute,
        [layout]: true
    });
    const iconValue = useMemo(() => {
        return layout === "big-icons" ? { size: "2em" } : {};
    }, [layout]);
    const labelText = typeof label === "string" ? label : label?.[lang?.id];
    return <div data-index={index} data-id={id} data-label={labelText} className={className} style={style} ref={ref}>
        <ItemDrag item={item} index={index} inRange={inRange} />
        <div className={classes({ icon: true, [layout]: true })}>
            <IconContext.Provider value={iconValue}>
                {icon}
            </IconContext.Provider>
        </div>
        <div className={classes({ label: true, [layout]: true })}>
            {labelText}
        </div>
    </div>;
}

export default Item;
