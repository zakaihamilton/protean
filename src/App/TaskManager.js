import Screen from "src/UI/Screen";
import { useCallback, useMemo } from "react";
import { BiWindows } from "react-icons/bi";
import Group from "src/UI/Widgets/Group";
import IconList from "src/UI/Widgets/IconList";

export default function TaskManager() {
    const screenManager = Screen.Manager.useManager();
    const list = useMemo(() => {
        return screenManager.list?.filter(item => item?.id !== "task-manager");
    }, [screenManager.list]);
    const icon = useMemo(() => <BiWindows />, []);
    const onClick = useCallback(item => {
        screenManager.forceFocusId = null;
        if (item?.focus) {
            item.minimize = true;
        }
        else {
            item.minimize = false;
            screenManager.focusId = item?.id;
        }
    }, [screenManager]);

    return <>
        <Screen.Rect left={50} top={300} width={300} height={300} />
        <Screen.State icon={icon} id="task-manager" label="Task Manager" accentBackground="gold" accentColor="black" />
        <Screen>
            <Group vertical flex>
                <IconList.State vertical list={list} onClick={onClick} />
                <IconList />
            </Group>
        </Screen>
    </>;
}
