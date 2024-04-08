import { createState } from "src/Core/Base/State";
import Group from "src/UI/Widgets/Group";
import Window from "src/UI/Window";
import Menu from "./ListEditor/Menu";
import { useEffect } from "react";
import Storage from "./ListEditor/Storage";

export default function ListEditor() {
    const state = ListEditor.State.useState();

    useEffect(() => {
        state.storage = Storage[0].Component;
    }, [state]);

    return <>
        <Menu />
        <Window.Region left={100} top={100} width={500} height={500} />
        <Window label="List Editor" maximize accentBackground="darkgreen">
            <Group>
            </Group>
        </Window>
    </>;
}

ListEditor.State = createState("ListEditor.State");
