import Background from "./Desktop/Background";
import Taskbar from "./Desktop/Taskbar";
import styles from "./Desktop.module.scss";
import { createRegion } from "../Core/UI/Region";
import { useElement } from "src/Core/UI/Element";
import Node from "src/Core/Base/Node";

function Desktop({ children }) {
    const ref = useElement();
    return <>
        <div className={styles.root}>
            <Background />
            <Taskbar.State visible={true} />
            <Desktop.Region target={ref?.current} />
            <div ref={ref} className={styles.screens}>
                {children}
            </div>
            <Node>
                <Taskbar />
            </Node>
        </div>
    </>;
}

Desktop.Region = createRegion("Desktop.Region");

export default Desktop;
