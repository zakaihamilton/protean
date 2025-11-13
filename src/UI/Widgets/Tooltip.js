import { useClasses } from "src/Core/Util/Styles";
import styles from "./Tooltip.module.scss";

import { useCallback, useMemo, useEffect, useRef } from 'react';
import { useEventListener } from "src/Core/UI/EventListener";
import Container from "../Util/Container";
import { useElement } from "src/Core/UI/Element";
import { createState } from "src/Core/Base/State";

export function getTooltipPos(tooltip, element) {
    if (!tooltip || !element) {
        return {};
    }
    const { left: elementLeft, top: elementTop } = element.getBoundingClientRect();
    const elementWidth = element?.offsetWidth;
    const elementHeight = element?.offsetHeight;
    const tooltipWidth = tooltip?.offsetWidth;
    const tooltipHeight = tooltip?.offsetHeight;
    let left = elementLeft + (elementWidth / 2) - (tooltipWidth / 2);
    let top = elementTop + elementHeight + 10;
    let arrowLeft = 50;

    if (left - (tooltipWidth / 2) < 0) {
        left = 10;
        arrowLeft = 0;
    }

    if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - (tooltipWidth) - 10;
        arrowLeft = 90;
    }

    if (top - (tooltipHeight / 2) < 0) {
        top = elementTop - (tooltipHeight / 2);
    }

    if (top + tooltipHeight * 2 > window.innerHeight) {
        top = elementTop - tooltipHeight;
    }

    return { left, top, "--arrow-left": arrowLeft + "%" };
}

export function useTooltip(ref, element, enabled) {
    const tooltip = Tooltip.State.useState();
    const timerRef = useRef(null);

    const handleMouseUp = useCallback(() => {
        clearTimeout(timerRef.current);
        tooltip(state => {
            state.visible = false;
        });
    }, [tooltip]);

    const handleMouseEnter = useCallback(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            tooltip(state => {
                state.visible = true;
            });
        }, 500);
    }, [tooltip]);

    const handleMouseLeave = useCallback(() => {
        clearTimeout(timerRef.current);
        tooltip(state => {
            state.visible = false;
        });
    }, [tooltip]);

    useEffect(() => {
        if (!enabled && tooltip.visible) {
            clearTimeout(timerRef.current);
            tooltip(state => {
                state.visible = false;
            });
        }
    }, [enabled, tooltip]);

    useEffect(() => {
        if (!ref || !element) {
            return;
        }
        tooltip(state => {
            state.position = getTooltipPos(ref, element);
        });
    }, [ref, element, tooltip]);

    useEventListener(element, "mouseup", enabled && handleMouseUp);
    useEventListener(element, "mouseenter", enabled && handleMouseEnter);
    useEventListener(element, "mouseleave", enabled && handleMouseLeave);

    return {
        visible: tooltip.visible,
        position: tooltip.position || { left: 0, top: 0 }
    };
}

function Tooltip({ title, description, enabled = true }) {
    const [target, tooltip] = useElement();
    let { element } = Container.State.useState() || {};
    const { visible, position } = useTooltip(target, element, enabled);
    const classes = useClasses(styles);
    const className = classes({
        root: true,
        visible
    });
    const titleClassName = classes({
        title: true,
        visible: title,
        hasDescription: description
    });
    const descriptionClassName = classes({
        description: true,
        visible: description,
        hasTitle: title
    });
    const descriptionLines = useMemo(() => {
        return description?.split("\\n").map((line, index) => {
            return <div className={styles.line} key={index}>{line}</div>;
        });
    }, [description]);
    if (!visible) {
        return null;
    }
    return <div ref={tooltip} style={{ ...position }} className={className}>
        <div className={titleClassName}>
            {title}
        </div>
        <div className={descriptionClassName}>
            {descriptionLines}
        </div>
    </div>;
}

Tooltip.State = createState("Tooltip.State");

export default Tooltip;