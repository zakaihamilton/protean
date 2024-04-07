import React from "react";
import { useClasses } from "src/Core/Util/Styles";
import styles from "./Button.module.scss";
import { withTheme } from "../../Core/UI/Theme";

function Button({ border, label, children, ...props }) {
    const classes = useClasses(styles);
    const className = classes({
        root: true,
        border
    });
    return <div className={className} {...props}>
        <div className={styles.label}>
            {label}
        </div>
        {children}
    </div>;
}

export default withTheme(Button);
