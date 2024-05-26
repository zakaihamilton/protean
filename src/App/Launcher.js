import Window from "src/UI/Window";
import { useCallback, useMemo } from "react";
import { SiLaunchpad } from "react-icons/si";
import Group from "src/UI/Widgets/Group";
import Apps from "src/Core/UI/Apps";
import IconList from "src/UI/Widgets/IconList";
import SupportedApps from "src/Apps";

export default function Launcher() {
    const icon = useMemo(() => <SiLaunchpad />, []);
    const apps = Apps.State.useState();
    const list = useMemo(() => {
        return SupportedApps;
    }, []);

    const onClick = useCallback(item => {
        apps.launch(item);
    }, [apps]);

    return <>
        <Window.Rect left={100} top={200} width={300} height={300} />
        <Window icon={icon} id="launcher" label="Launcher" accentBackground="purple">
            <Group vertical flex>
                <IconList list={list} flex wrap onClick={onClick} />
            </Group>
        </Window>
    </>;
}
