import { useEffect, useState } from "react";
import { useElement } from "src/Core/UI/Element";
import { createState } from "src/Core/Base/State";
import styles from "./Container.module.scss";
import { createRegion, useMonitorSizeOfElements } from "src/Core/UI/Region";
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
    const container = Container.State.useState();
    const element = ref?.current;
    useEffect(() => {
        container.element = element || undefined;
    }, [container, element]);
    const sizeCounter = useMonitorSizeOfElements(container.items);
    useEffect(() => {
        container.sizeCounter = sizeCounter;
    }, [container, sizeCounter]);
    return <>
        <div ref={ref} className={styles.root} {...props}>
            <Container.Region target={ref?.current} />
            {children}
        </div>
    </>;
}

export function useContainerItem(index, item) {
    const container = Container.State.useState();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (item) {
            container.items = (container.items || []).toSpliced(index, 0, item);
            setMounted(true);
        }

        return () => {
            if (item) {
                const currentItems = container.items || [];
                const itemIndexToRemove = currentItems.indexOf(item);
                if (itemIndexToRemove !== -1) {
                    container.items = currentItems.toSpliced(itemIndexToRemove, 1);
                }

                setMounted(false);
            }
        };
    }, [container, index, item]);

    return [mounted, container];
}

Container.State = createState("Container.State");
Container.Region = createRegion("Container.Region");

export default Container;
