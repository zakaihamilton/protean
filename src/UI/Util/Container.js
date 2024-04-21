import { useEffect } from "react";
import { useElement } from "src/Core/Base/Element";
import { createState } from "src/Core/Base/State";
import styles from "./Container.module.scss";
import { withNode } from "src/Core/Base/Node";

function Container({ children, ...props }) {
    const ref = useElement();
    const state = Container.State.useState(undefined, null);
    const element = ref?.current;
    useEffect(() => {
        state.element = element;
    }, [state, element]);
    return <div ref={ref} className={styles.root} {...props}>
        {children}
    </div>;
}

Container.State = createState("Container.State");

export default withNode(Container);
