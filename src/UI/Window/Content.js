import styles from "./Content.module.scss";
import { withTheme } from "../../Core/UI/Theme";
import { createRegion } from "src/Core/UI/Region";
import { useElement } from "src/Core/Base/Element";

function Content({ children }) {
    const ref = useElement();

    return (
        <>
            <Content.Region target={ref?.current} />
            <div ref={ref} className={styles.root}>
                {children}
            </div>
        </>
    );
}

export default withTheme(Content);

Content.Region = createRegion("Content.Region");
