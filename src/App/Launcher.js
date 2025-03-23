import Window from "src/UI/Window";
import { useCallback, useMemo } from "react";
import { SiLaunchpad } from "react-icons/si";
import Group from "src/UI/Widgets/Group";
import Apps from "src/Core/UI/Apps";
import IconList from "src/UI/Widgets/IconList";
import SupportedApps from "src/Apps";
import Search from "src/UI/Widgets/Search";
import { createState } from "src/Core/Base/State";
import { useDynamic } from "src/Core/Base/Dynamic";
import Windows from "src/Core/UI/Windows";
import Node from "src/Core/Base/Node";

export default function Launcher() {
    const windows = Windows.State.useState();
    const launcher = Launcher.State.useState();
    const icon = useMemo(() => <SiLaunchpad />, []);
    const apps = Apps.State.useState();
    const list = useMemo(() => {
        return SupportedApps.filter(app => !launcher.search || app?.label?.toLowerCase()?.includes(launcher.search?.toLowerCase()));
    }, [launcher?.search]);
    const searchDynamic = useDynamic(launcher, "search");

    const onClick = useCallback(item => {
        windows.forceFocusId = null;
        apps.launch(item);
    }, [windows, apps]);

    return <Node>
        <Window.Rect left={100} top={200} width={300} height={300} />
        <Window.Actions close={false} />
        <Window.State icon={icon} id="launcher" label="Launcher" accentBackground="purple" />
        <Window>
            <Group vertical flex>
                <Search dynamic={searchDynamic} />
                <IconList.State list={list} flex wrap onClick={onClick} layout="big-icons" />
                <IconList />
            </Group>
        </Window>
    </Node>;
}

Launcher.State = createState("Launcher.State");
