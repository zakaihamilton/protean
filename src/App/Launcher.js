import Screen from "src/UI/Screen";
import { useCallback, useMemo } from "react";
import { SiLaunchpad } from "react-icons/si";
import Group from "src/UI/Widgets/Group";
import Apps from "src/Core/UI/Apps";
import IconList from "src/UI/Widgets/IconList";
import SupportedApps from "src/Apps";
import Search from "src/UI/Widgets/Search";
import { createState } from "src/Core/Base/State";
import { useDynamic } from "src/Core/Util/Dynamic";

export default function Launcher() {
    const screenManager = Screen.Manager.useManager();
    const launcher = Launcher.State.useState();
    const icon = useMemo(() => <SiLaunchpad />, []);
    const apps = Apps.State.useState();
    const list = useMemo(() => {
        return SupportedApps.filter(app => !launcher.search || app?.label?.toLowerCase()?.includes(launcher.search?.toLowerCase()));
    }, [launcher?.search]);
    const searchDynamic = useDynamic(launcher, "search");

    const onClick = useCallback(item => {
        screenManager.forceFocusId = null;
        apps.appId = null;
        apps.appId = item?.id;
    }, [screenManager, apps]);

    return <>
        <Screen.Rect left={100} top={200} width={300} height={400} />
        <Screen.Actions close={false} />
        <Screen.State icon={icon} id="launcher" label="Launcher" accentBackground="purple" />
        <Screen>
            <Group vertical flex>
                <Search dynamic={searchDynamic} />
                <IconList.State list={list} flex wrap onClick={onClick} layout="big-icons" />
                <IconList />
            </Group>
        </Screen>
    </>;
}

Launcher.State = createState("Launcher.State");
