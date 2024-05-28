import React, { useMemo } from "react";
import { useClasses } from "src/Core/Util/Styles";
import styles from "./Button.module.scss";
import Tooltip from "src/UI/Widgets/Tooltip";
import Container from "src/UI/Util/Container";

export default function Button({ id, icon, row, column, label, children, width, enabled, tooltip, ...props }) {
    const classes = useClasses(styles);
    const buttonClassName = classes({
        button: true,
        [id]: true,
        enabled
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
    return <Container style={style} className={styles.root}>
        <div className={buttonClassName} {...props}>
            <div className={styles.content}>
                {content}
            </div>
            {children}
        </div>
        <Tooltip title={title} enabled={enabled} />
    </Container>;
}
