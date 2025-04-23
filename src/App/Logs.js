import Window from "src/UI/Window";
import { VscDebugAltSmall } from "react-icons/vsc";
import { useMemo } from "react";
import Group from "src/UI/Widgets/Group";
import Logger from "src/Core/Util/Logger";
import styles from "./Logs.module.scss";

export default function Logs() {
    const logger = Logger.State.useState();
    const icon = useMemo(() => <VscDebugAltSmall />, []);

    const elements = useMemo(() => {
        let elements = [];
        elements.push(...logger.items?.map((item, index) => {
            const { type, message } = item;
            return <div className={styles.item} key={index}>{type}: {message}</div>;
        }) || []);
        return elements;
    }, [logger.items]);

    return <>
        <Window.Rect left={200} top={100} width={400} height={600} />
        <Window.State icon={icon} id="logs" label="Logs" accentBackground="darkorange" />
        <Window>
            <Group vertical>
                {elements}
            </Group>
        </Window>
    </>;
}
