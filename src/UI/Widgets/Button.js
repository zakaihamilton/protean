import React from "react";
import { joinClassNames } from "src/Core/Util/Styles";
import styles from "./Button.module.scss";
import { withTheme } from "../Util/Theme";

function Button({ border, label, children, ...props }) {
    const className = joinClassNames(styles.root, border && styles.border);
    return <div className={className} {...props}>
        <div className={styles.label}>
            {label}
        </div>
        {children}
    </div>;
}

export default withTheme(Button);
