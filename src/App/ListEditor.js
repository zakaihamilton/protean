import { createState } from "src/Core/Base/State";
import Group from "src/UI/Widgets/Group";
import Window from "src/UI/Window";
import Menu from "./ListEditor/Menu";
import { useEffect } from "react";
import Storage from "./ListEditor/Storage";
import Content from "src/UI/Window/Content";
import Tags from "src/UI/Widgets/Tags";

export default function ListEditor() {
    const state = ListEditor.State.useState();
    const contentRegion = Content.Region.useRegion();
    const windowRegion = Window.Region.useRegion();

    useEffect(() => {
        state.storage = Storage[0].Component;
    }, [state]);

    return <>
        <Menu />
        <Window.Rect left={100} top={100} width={500} height={500} />
        <Window label="List Editor" maximize accentBackground="darkgreen">
            <Group vertical>
                <Tags tags={{ ...contentRegion }} border />
                <Tags tags={{ ...windowRegion }} border />
            </Group>
        </Window>
    </>;
}

ListEditor.State = createState("ListEditor.State");
