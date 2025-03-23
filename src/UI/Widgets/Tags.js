import { useClasses } from "src/Core/Util/Styles";
import styles from "./Tags.module.scss";
import { useMemo } from "react";

function Tags({ tags, vertical, border, title }) {
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

    const rootClassName = classes({
        root: true,
        vertical,
        border
    });

    const tagsClassName = classes({
        tags: true,
        vertical,
        border
    });

    return <div className={rootClassName}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={tagsClassName}>
            {elements}
        </div>
    </div>;
}

export default Tags;