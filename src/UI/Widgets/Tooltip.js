import { useClasses } from "src/Core/Util/Styles";
import styles from "./Tooltip.module.scss";
import { withTheme } from "src/Core/UI/Theme";

import { useState, useRef, useCallback } from 'react';
import { useEventListener } from "src/Core/UI/EventListener";

export function getTooltipPos(tooltip, element) {
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

    if (top + (tooltipHeight / 2) > window.innerHeight) {
        top -= (tooltipHeight / 2);
    }

    return { left, top, "--arrow-left": arrowLeft + "%" };
}

function useTooltip(tooltipRef, forRef) {
    const tooltip = tooltipRef?.current;
    let element = forRef?.current;
    if (!element) {
        element = tooltip?.nextSibling;
    }

    const [visible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const timerRef = useRef();

    const handleMouseEnter = useCallback(() => {
        const position = getTooltipPos(tooltip, element);
        setPosition(position);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsVisible(true);
        }, 500);
    }, [tooltip, element]);

    const handleMouseLeave = useCallback(() => {
        clearTimeout(timerRef.current);
        setIsVisible(false);
    }, []);

    useEventListener(element, "mouseenter", handleMouseEnter);
    useEventListener(element, "mouseleave", handleMouseLeave);

    return { visible, position };
};

function Tooltip({ children, label, forRef }) {
    const tooltipRef = useRef();
    const { visible, position } = useTooltip(tooltipRef, forRef);
    const classes = useClasses(styles);
    const classesName = classes({
        root: true,
        visible
    });
    return (<>
        <div ref={tooltipRef} style={{ ...position }} className={classesName}>
            {label}
        </div>
        {children}
    </>);
};

export default withTheme(Tooltip);