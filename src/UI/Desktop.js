import { withTheme } from "../Core/UI/Theme";
import Background from "./Desktop/Background";
import Taskbar from "./Desktop/Taskbar";
import styles from "./Desktop.module.scss";
import { createRegion } from "../Core/UI/Region";
import { useElement } from "src/Core/Base/Element";

function Desktop({ children }) {
    const ref = useElement();
    return <div className={styles.root}>
        <Background />
        <Taskbar.State visible={true} />
        <Desktop.Region target={ref?.current} />
        <div ref={ref} className={styles.windows}>
            {children}
        </div>
        <Taskbar />
    </div>;
}

Desktop.Region = createRegion("Desktop.Region");

export default withTheme(Desktop);
