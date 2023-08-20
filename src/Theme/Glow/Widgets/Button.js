import { extendTheme } from "src/UI/Util/Theme";
import styles from "./Button.module.scss";
import Button from "src/UI/Widgets/Button"
import { joinClassNames } from "src/Core/Util/Styles";

function GlowButton({ border, label, children, ...props }) {
    const className = joinClassNames(styles.root, border && styles.border);
    return <div className={className} {...props}>
        <div className={styles.label}>
            {label}
        </div>
        {children}
    </div>;
}

extendTheme(Button, "glow", GlowButton);
