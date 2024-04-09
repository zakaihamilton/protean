import { useClasses } from "src/Core/Util/Styles";
import styles from "./Tags.module.scss";
import { withTheme } from "src/Core/UI/Theme";
import { useMemo } from "react";

function Tags({ tags, vertical, border }) {
    const classes = useClasses(styles);

    const elements = useMemo(() => {
        const keys = Object.keys(tags);
        return keys.map(key => {
            const value = tags[key];
            return <div key={key} className={styles.tag}>
                <div className={styles.key}>
                    {key}
                </div>
                <div className={styles.value}>
                    {value}
                </div>
            </div>;
        })
    }, [tags]);

    return <div className={classes({ root: true, vertical, border })}>
        {elements}
    </div>;
}

export default withTheme(Tags);