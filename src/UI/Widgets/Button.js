import React from "react";
import { className } from "src/Core/Util/Styles";
import styles from "./Button.module.scss";
import { withTheme } from "../../Core/UI/Theme";

function Button({ border, label, children, ...props }) {
    const classes = className(styles.root, border && styles.border);
    return <div className={classes} {...props}>
        <div className={styles.label}>
            {label}
        </div>
        {children}
    </div>;
}

export default withTheme(Button);
