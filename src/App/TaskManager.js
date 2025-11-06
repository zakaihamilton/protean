import Screen from "src/UI/Screen";
import { useCallback, useMemo } from "react";
import { BiWindows } from "react-icons/bi";
import Group from "src/UI/Widgets/Group";
import IconList from "src/UI/Widgets/IconList";
import Resources from "src/Core/UI/Resources";

const resources = {
    TITLE: {
        eng: "Task Manager",
        heb: "מנהל משימות"
    }
};

export default function TaskManager() {
    const lookup = Resources.useLookup();
    const screenManager = Screen.Manager.useManager();
    const list = useMemo(() => {
        return screenManager.list?.filter(item => item?.id !== "task-manager");
    }, [screenManager.list]);
    const icon = useMemo(() => <BiWindows />, []);
    const onClick = useCallback(item => {
        screenManager(state => {
            state.forceFocusId = null;
            if (item?.focus) {
                item(i => { i.minimize = true; });
            }
            else {
                item(i => { i.minimize = false; });
                state.focusId = item?.id;
            }
        });
    }, [screenManager]);

    return <Resources resources={resources} lookup={lookup}>
        <Screen.Rect left={50} top={300} width={300} height={300} />
        <Screen.State icon={icon} id="task-manager" label={lookup?.TITLE} assetColor="gold" assetTextColor="black" />
        <Screen>
            <Group vertical flex>
                <IconList.State vertical list={list} onClick={onClick} />
                <IconList />
            </Group>
        </Screen>
    </Resources>;
}
