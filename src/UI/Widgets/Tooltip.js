import { useClasses } from "src/Core/Util/Styles";
import styles from "./Tooltip.module.scss";
import { withTheme } from "src/Core/UI/Theme";

import { useState, useRef, useCallback } from 'react';
import { useEventListener } from "src/Core/UI/EventListener";

export function getTooltipPos(tooltip, element) {
    const { left: elementLeft, top: elementTop } = element.getBoundingClientRect();
    const childWidth = element?.offsetWidth;
    const childHeight = element?.offsetHeight;
    const tooltipWidth = tooltip?.offsetWidth;
    const tooltipHeight = tooltip?.offsetHeight;
    let left = elementLeft + (childWidth / 4);
    let top = elementTop + (childHeight / 2);
    let shiftLeft = 50;

    if (left - (tooltipWidth / 2) < 0) {
        left = 10;
        shiftLeft = 0;
    }

    if (left + (tooltipWidth / 2) > window.innerWidth) {
        left = window.innerWidth - (tooltipWidth / 2) - 10;
        shiftLeft = 90;
    }

    if (top - (tooltipHeight / 2) < 0) {
        top = elementTop - (tooltipHeight / 2);
    }

    if (top + (tooltipHeight / 2) > window.innerHeight) {
        top -= (tooltipHeight / 2);
    }

    return { left, top, "--shift-left": shiftLeft + "%" };
}

function useTooltip(tooltipRef, forRef) {
    const tooltip = tooltipRef.current;
    const element = forRef.current;
    const [visible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const timerRef = useRef();

    const handleMouseEnter = useCallback(() => {
        const position = getTooltipPos(tooltip, element);
        console.log(position);
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
    const elementRef = useRef();
    const { visible, position } = useTooltip(elementRef, forRef);
    const classes = useClasses(styles);
    const classesName = classes({
        root: true,
        visible
    });
    return (<>
        {children}
        <div ref={elementRef} style={{ ...position }} className={classesName}>
            {label}
        </div>
    </>);
};

export default withTheme(Tooltip);