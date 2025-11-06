import { useEffect, useMemo, useState } from "react";
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
    const [node, element] = useElement();
    const container = Container.State.useState();
    useEffect(() => {
        container.element = node || undefined;
    }, [container, node]);
    const sizeCounter = useMonitorSizeOfElements(container.items);
    useEffect(() => {
        container.sizeCounter = sizeCounter;
    }, [container, sizeCounter]);
    return <>
        <div ref={element} className={styles.root} {...props}>
            <Container.Region target={node} />
            {children}
        </div>
    </>;
}

export function useContainerItem(index, item) {
    const container = Container.State.useState();
    const mounted = useMemo(() => !!(item && container.items?.includes(item)), [item, container.items]);

    useEffect(() => {
        if (item) {
            container(state => {
                state.items = (state.items || []).toSpliced(index, 0, item);
            });
        }

        return () => {
            if (item) {
                const currentItems = container.items || [];
                const itemIndexToRemove = currentItems.indexOf(item);
                if (itemIndexToRemove !== -1) {
                    container(state => {
                        state.items = currentItems.toSpliced(itemIndexToRemove, 1);
                    });
                }
            }
        };
    }, [container, index, item]);

    return [mounted, container];
}

Container.State = createState("Container.State");
Container.Region = createRegion("Container.Region");

export default Container;
