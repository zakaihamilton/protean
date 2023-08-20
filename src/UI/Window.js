import { useMemo, useRef } from "react";
import { withState } from "../Core/Base/State";
import { joinClassNames } from "../Core/Util/Styles";
import styles from "./Window.module.scss";
import Content from "./Window/Content";
import Title from "./Window/Title";
import Drag from "./Util/Drag";
import Region from "./Util/Region";
import Resize from "./Window/Resize";

function Window({ children }) {
    const region = Region.useState();
    const style = { ...region };
    const ref = useRef(null);
    const min = useMemo(() => ({ width: 150, height: 150 }), []);
    return (
        <>
            <Drag source={ref?.current} region={region} min={min} />
            <div ref={ref} className={joinClassNames(styles.root)} style={style}>
                <Title />
                <Content>
                    {children}
                </Content>
                <Resize />
            </div>
        </>
    )
}

export default withState(Window);
