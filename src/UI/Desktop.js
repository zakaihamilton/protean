import { withTheme } from "./Util/Theme";
import Background from "./Desktop/Background";
import Taskbar from "./Desktop/Taskbar";
import styles from "./Desktop.module.scss";
import { createRegion } from "./Util/Region";
import { useRef } from "react";
import Node from "src/Core/Base/Node";

function Desktop({ children }) {
    const ref = useRef();
    return <div className={styles.root}>
        <Node>
            <Background />
            <Desktop.Region target={ref?.current} />
            <div ref={ref} className={styles.windows}>
                {children}
            </div>
            <Taskbar />
        </Node>
    </div>;
}

Desktop.Region = createRegion("Desktop.Region");

export default withTheme(Desktop);
