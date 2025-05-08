import styles from "./Content.module.scss";
import { createRegion } from "src/Core/UI/Region";
import { useElement } from "src/Core/UI/Element";
import Screen from "../Screen";

function Content({ children }) {
    const ref = useElement();
    const rect = Screen.Rect.useState();

    return (
        <>
            <Content.Region target={ref?.current} counter={rect.__counter} />
            <div ref={ref} className={styles.root}>
                {children}
            </div>
        </>
    );
}

export default Content;

Content.Region = createRegion("Content.Region");
