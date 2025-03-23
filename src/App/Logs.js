import Window from "src/UI/Window";
import { VscDebugAltSmall } from "react-icons/vsc";
import { useMemo } from "react";
import Group from "src/UI/Widgets/Group";
import Logger from "src/Core/Base/Logger";
import styles from "./Logs.module.scss";
import Node from "src/Core/Base/Node";

export default function Logs() {
    const logger = Logger.State.useState({ id: "logs" });
    const icon = useMemo(() => <VscDebugAltSmall />, []);

    const elements = useMemo(() => {
        let elements = [];
        elements.push(...logger.items?.map((item, index) => {
            const { type, message } = item;
            return <div className={styles.item} key={index}>{type}: {message}</div>;
        }) || []);
        return elements;
    }, [logger.items]);

    return <Node>
        <Window.Rect left={200} top={100} width={400} height={600} />
        <Window icon={icon} id="logs" label="Logs" accentBackground="darkorange">
            <Group vertical>
                {elements}
            </Group>
        </Window>
    </Node>;
}
