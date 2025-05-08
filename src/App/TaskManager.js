import Screen from "src/UI/Screen";
import { useCallback, useMemo } from "react";
import { BiWindows } from "react-icons/bi";
import Group from "src/UI/Widgets/Group";
import Screens from "src/Core/UI/Screens";
import IconList from "src/UI/Widgets/IconList";

export default function TaskManager() {
    const screens = Screens.State.useState();
    const list = useMemo(() => {
        return screens.list?.filter(item => item?.id !== "task-manager");
    }, [screens.list]);
    const icon = useMemo(() => <BiWindows />, []);
    const onClick = useCallback(item => {
        screens.forceFocusId = null;
        if (item?.focus) {
            item.minimize = true;
        }
        else {
            item.minimize = false;
            screens.focusId = item?.id;
        }
    }, [screens]);

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
