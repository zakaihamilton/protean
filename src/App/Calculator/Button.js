import React, { useMemo } from "react";
import { useClasses } from "src/Core/Util/Styles";
import styles from "./Button.module.scss";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";

export default function Button({ id, icon, row, column, label, children, width, tooltip, ...props }) {
    const classes = useClasses(styles);
    const className = classes({
        root: true,
        [id]: true
    });
    const style = useMemo(() => {
        return {
            gridColumnStart: column,
            gridColumnEnd: column + (width || 1),
            gridRowStart: row
        };
    }, [column, row, width]);
    let content = icon || label;
    if (typeof content === "function") {
        content = content();
    }
    const title = typeof tooltip === "function" ? tooltip() : tooltip;
    return <Container style={style}>
        <Tooltip title={title} />
        <div className={className} {...props}>
            <div className={styles.content}>
                {content}
            </div>
            {children}
        </div>
    </Container>;
}
