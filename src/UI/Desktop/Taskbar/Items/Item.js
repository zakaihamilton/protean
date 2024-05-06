import { withTheme } from "src/Core/UI/Theme";
import styles from "./Item.module.scss";
import { useClasses } from "src/Core/Util/Styles";
import { useCallback, useMemo } from "react";
import { useStateFromObject } from "src/Core/Base/State";
import Drag from "src/Core/UI/Drag";
import { useMoveDrag } from "src/Core/UI/Drag/Move";
import { withNode } from "src/Core/Base/Node";
import Windows from "src/UI/Windows";
import Container from "src/UI/Util/Container";
import { getHitTargets } from "src/Core/UI/Region";
import { moveItem } from "src/Core/Base/Array";
import Items from "../Items";

const DRAG_RANGE = 12;

function Item({ item, index, vertical }) {
    const windows = Windows.State.useState(null);
    const classes = useClasses(styles);
    const container = Container.State.useState();
    const { label, focus, minimize, icon } = useStateFromObject(item);
    const drag = Drag.useState(undefined, null);
    const ref = useMoveDrag(true);
    const items = Items.State.useState();
    const inRange = vertical ?
        (Math.abs(drag?.dragged?.y) > DRAG_RANGE) :
        (Math.abs(drag?.dragged?.x) > DRAG_RANGE);
    const style = useMemo(() => {
        if (!items?.target || items?.target?.index <= index) {
            return {};
        }
        if (vertical) {
            return {
                "--top": 0
            };
        }
        else {
            const left = items.target.width + "px";
            return {
                "--left": left
            };
        }
    }, [index, items.target, vertical]);
    const draggableStyle = useMemo(() => {
        if (vertical) {
            const top = (inRange && drag?.rect?.top || 0) + "px";
            return {
                "--top": top
            };
        }
        else {
            const left = (inRange && drag?.rect?.left || 0) + "px";
            return {
                "--left": left
            };
        }
    }, [drag?.rect?.left, drag?.rect?.top, inRange, vertical]);
    const onDragMove = useCallback((state, handle) => {
        const hitTargets = getHitTargets(container.element, handle);
        const hitTarget = hitTargets?.[hitTargets?.length - 1];
        if (hitTarget) {
            const targetIndex = parseInt(hitTarget.dataset.index);
            items.target = { index: targetIndex, width: state.base.width, height: state.base.height };
        }
    }, [container.element, items]);
    const onDragEnd = useCallback((state, handle) => {
        items.target = undefined;
        if (vertical ? Math.abs(state.dragged?.y) > DRAG_RANGE : Math.abs(state.dragged?.x) > DRAG_RANGE) {
            const hitTargets = getHitTargets(container.element, handle);
            const hitTarget = hitTargets?.[hitTargets?.length - 1];
            if (hitTarget) {
                const targetIndex = parseInt(hitTarget.dataset.index);
                windows.list = moveItem(windows.list, index, targetIndex, item);
            }
            return;
        }
        if (item?.focus) {
            item.minimize = true;
        }
        else {
            item.minimize = false;
            item.focus = true;
        }
    }, [container.element, index, item, windows, vertical, items]);
    const className = classes({
        root: true,
        vertical
    });
    const staticClassName = classes({
        item: true,
        static: true,
        moving: drag.moving,
        range: inRange,
        vertical
    });
    const draggableClassName = classes({
        item: true,
        draggable: true,
        focus,
        minimize,
        moving: drag.moving,
        range: inRange,
        vertical
    });
    const element = useMemo(() => (
        <>
            <div className={styles.icon}>
                {icon}
            </div>
            <div className={styles.label}>
                {label}
            </div>
        </>
    ), [icon, label]);
    return <div data-index={index} data-label={label} className={className} style={style}>
        <Drag marginLeft={DRAG_RANGE} onDragMove={onDragMove} onDragEnd={onDragEnd} />
        <div className={staticClassName}>
            {element}
        </div>
        <div ref={ref} className={draggableClassName} style={draggableStyle}>
            {element}
        </div>
    </div>;
}

export default withNode(withTheme(Item));
