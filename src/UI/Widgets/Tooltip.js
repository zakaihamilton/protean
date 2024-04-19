import { useClasses } from "src/Core/Util/Styles";
import styles from "./Tooltip.module.scss";
import { withTheme } from "src/Core/UI/Theme";

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useEventListener } from "src/Core/UI/EventListener";
import Container from "../Util/Container";
import { useElement } from "src/Core/Base/Element";

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

    if (top + (tooltipHeight / 2) > window.innerHeight) {
        top -= (tooltipHeight / 2);
    }

    return { left, top, "--arrow-left": arrowLeft + "%" };
}

export function useTooltip(tooltip, element) {
    const [visible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const timerRef = useRef();

    const handleMouseEnter = useCallback(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsVisible(true);
        }, 500);
    }, []);

    const handleMouseLeave = useCallback(() => {
        clearTimeout(timerRef.current);
        setIsVisible(false);
    }, []);

    useEffect(() => {
        if (!tooltip || !element) {
            return;
        }
        const position = getTooltipPos(tooltip, element);
        setPosition(position);
    }, [tooltip, element]);

    useEventListener(element, "mouseenter", handleMouseEnter);
    useEventListener(element, "mouseleave", handleMouseLeave);

    return { visible, position };
};

function Tooltip({ title, description }) {
    const tooltipRef = useElement();
    let { element } = Container.State.useState() || {};
    const { visible, position } = useTooltip(tooltipRef.current, element);
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
    return <div ref={tooltipRef} style={{ ...position }} className={className}>
        <div className={titleClassName}>
            {title}
        </div>
        <div className={descriptionClassName}>
            {descriptionLines}
        </div>
    </div>;
};

export default withTheme(Tooltip);