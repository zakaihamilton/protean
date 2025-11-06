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
import Resources from "src/Core/UI/Resources";
import Lang from "src/Core/UI/Lang";

const resources = {
    TITLE: {
        eng: "Launcher",
        heb: "מנהל תוכניות"
    },
    SEARCH: {
        eng: "Search",
        heb: "חיפוש"
    }
};

export default function Launcher() {
    const lang = Lang.State.useState();
    const lookup = Resources.useLookup();
    const screenManager = Screen.Manager.useManager();
    const launcher = Launcher.State.useState();
    const icon = useMemo(() => <SiLaunchpad />, []);
    const apps = Apps.State.useState();
    const list = useMemo(() => {
        return SupportedApps.filter(app => !launcher.search || app?.label[lang?.id]?.toLowerCase()?.includes(launcher.search?.toLowerCase()));
    }, [launcher.search, lang?.id]);
    const searchDynamic = useDynamic(launcher, "search");

    const onClick = useCallback(item => {
        screenManager(state => {
            state.forceFocusId = null;
        });
        apps(state => {
            state.appId = null;
        });
        apps(state => {
            state.appId = item?.id;
        });
    }, [screenManager, apps]);

    return <Resources resources={resources} lookup={lookup}>
        <Screen.Rect left={100} top={200} width={300} height={400} />
        <Screen.Actions close={false} />
        <Screen.State icon={icon} id="launcher" label={lookup?.TITLE} assetColor="purple" />
        <Screen>
            <Group vertical flex>
                <Search dynamic={searchDynamic} placeholder={lookup?.SEARCH + "..."} />
                <IconList.State list={list} flex wrap onClick={onClick} layout="big-icons" />
                <IconList />
            </Group>
        </Screen>
    </Resources>;
}

Launcher.State = createState("Launcher.State");
