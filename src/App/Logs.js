import Screen from "src/UI/Screen";
import { VscDebugAltSmall } from "react-icons/vsc";
import { useMemo } from "react";
import Group from "src/UI/Widgets/Group";
import Logger from "src/Core/Util/Logger";
import styles from "./Logs.module.scss";
import Resources from "src/Core/UI/Resources";

const resources = {
    TITLE: {
        eng: "Logs",
        heb: "יומן"
    }
};

export default function Logs() {
    const lookup = Resources.useLookup();
    const logger = Logger.State.useState();
    const icon = useMemo(() => <VscDebugAltSmall />, []);

    const elements = useMemo(() => {
        let elements = [];
        elements.push(...logger.items?.map((item, index) => {
            const { type, message } = item;
            return <div className={styles.item} key={index}><div className={styles.type}>{type}</div>{message}</div>;
        }) || []);
        return elements;
    }, [logger.items]);

    return <Resources resources={resources} lookup={lookup}>
        <Screen.Rect left={200} top={100} width={400} height={600} />
        <Screen.State icon={icon} id="logs" label={lookup?.TITLE} assetColor="darkorange" />
        <Screen>
            <Group vertical>
                {elements}
            </Group>
        </Screen>
    </Resources>;
}
