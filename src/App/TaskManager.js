import Window from "src/UI/Window";
import { useCallback, useMemo } from "react";
import { BiWindows } from "react-icons/bi";
import Group from "src/UI/Widgets/Group";
import Windows from "src/Core/UI/Windows";
import IconList from "src/UI/Widgets/IconList";

export default function TaskManager() {
    const windows = Windows.State.useState();
    const list = useMemo(() => {
        return windows.list?.filter(item => item?.id !== "task-manager");
    }, [windows.list]);
    const icon = useMemo(() => <BiWindows />, []);
    const onClick = useCallback(item => {
        windows.forceFocusId = null;
        if (item?.focus) {
            item.minimize = true;
        }
        else {
            item.minimize = false;
            windows.focusId = item?.id;
        }
    }, [windows]);

    return <>
        <Window.Rect left={50} top={300} width={300} height={300} />
        <Window.State icon={icon} id="task-manager" label="Task Manager" accentBackground="gold" accentColor="black" />
        <Window>
            <Group vertical flex>
                <IconList.State vertical list={list} onClick={onClick} />
                <IconList />
            </Group>
        </Window>
    </>;
}
