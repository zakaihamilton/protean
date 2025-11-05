import styles from "./Content.module.scss";
import { createRegion } from "src/Core/UI/Region";
import { useElement } from "src/Core/UI/Element";
import Screen from "../Screen";

function Content({ children }) {
    const [node, element] = useElement();
    const rect = Screen.Rect.useState();

    return (
        <>
            <Content.Region target={node} counter={rect.__counter} />
            <div ref={element} className={styles.root}>
                {children}
            </div>
        </>
    );
}

export default Content;

Content.Region = createRegion("Content.Region");
