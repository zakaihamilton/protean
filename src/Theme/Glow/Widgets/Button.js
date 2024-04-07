import { replaceTheme } from "src/Core/UI/Theme";
import styles from "./Button.module.scss";
import Button from "src/UI/Widgets/Button"
import { useClasses } from "src/Core/Util/Styles";

function GlowButton({ border, label, children, ...props }) {
    const classes = useClasses(styles);
    const className = classes({ root: true, border });
    return <div className={className} {...props}>
        <div className={styles.label}>
            {label}
        </div>
        {children}
    </div>;
}

replaceTheme(Button, "glow", GlowButton);
