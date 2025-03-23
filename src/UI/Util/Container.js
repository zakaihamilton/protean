import { useEffect } from "react";
import { useElement } from "src/Core/Base/Element";
import { createState } from "src/Core/Base/State";
import styles from "./Container.module.scss";
import { createRegion } from "src/Core/UI/Region";
import Node from "src/Core/Base/Node";

function Container({ children, ...props }) {
    return <Node>
        <Container.Item {...props}>
            {children}
        </Container.Item>
    </Node>;
}

Container.Item = function ContainerItem({ children, ...props }) {
    const ref = useElement();
    const container = Container.State.useState({ nodeId: null });
    const element = ref?.current;
    useEffect(() => {
        container.element = element || undefined;
    }, [container, element]);
    return <>
        <div ref={ref} className={styles.root} {...props}>
            <Container.Region target={ref?.current} />
            {children}
        </div>
    </>;
}

export function useContainerItem(index, item) {
    const container = Container.State.useState();
    useEffect(() => {
        if (item) {
            const items = Object.assign({}, container.items);
            items[index] = item;
            container.items = items;
        }
        return () => {
            if (item) {
                const items = Object.assign({}, container.items);
                delete items[index];
                container.items = items;
            }
        }
    }, [container, index, item]);
    return container;
}

Container.State = createState("Container.State");
Container.Region = createRegion("Container.Region");

export default Container;
