import Window from "src/UI/Window";
import { useMemo } from "react";
import { BiWindows } from "react-icons/bi";
import Group from "src/UI/Widgets/Group";
import Items from "src/UI/Desktop/Taskbar/Items";
import Windows from "src/UI/Windows";

export default function TaskManager() {
    const windows = Windows.State.useState();
    const list = useMemo(() => {
        return windows.list?.filter(item => item.label !== "Task Manager");
    }, [windows.list]);
    const icon = useMemo(() => <BiWindows />, []);

    return <>
        <Window.Rect left={50} top={300} width={300} height={300} />
        <Window icon={icon} label="Task Manager" accentBackground="gold" accentColor="black">
            <Group vertical>
                <Items vertical list={list} />
            </Group>
        </Window>
    </>;
}
