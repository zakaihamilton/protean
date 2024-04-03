import { replaceTheme } from "src/Core/UI/Theme";
import styles from "./Button.module.scss";
import Button from "src/UI/Widgets/Button"
import { className } from "src/Core/Util/Styles";

function GlowButton({ border, label, children, ...props }) {
    const classes = className(styles.root, border && styles.border);
    return <div className={classes} {...props}>
        <div className={styles.label}>
            {label}
        </div>
        {children}
    </div>;
}

replaceTheme(Button, "glow", GlowButton);
