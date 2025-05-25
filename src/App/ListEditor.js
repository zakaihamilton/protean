import { createState } from "src/Core/Base/State";
import Group from "src/UI/Widgets/Group";
import Screen from "src/UI/Screen";
import Menu from "./ListEditor/Menu";
import { useEffect, useMemo } from "react";
import Storage from "./ListEditor/Storage";
import Content from "src/UI/Screen/Content";
import Tags from "src/UI/Widgets/Tags";
import { MdOutlineListAlt } from "react-icons/md";

export default function ListEditor() {
    const listEditor = ListEditor.State.useState();
    const contentRegion = Content.Region.useRegion();
    const screenRegion = Screen.Region.useRegion();

    useEffect(() => {
        listEditor.storage = Storage[0].Component;
    }, [listEditor]);

    const icon = useMemo(() => <MdOutlineListAlt />, []);

    return <>
        <Menu />
        <Screen.Rect left={100} top={100} width={500} height={500} />
        <Screen.State icon={icon} id="list-editor" label="List Editor" maximize assetColor="darkgreen" />
        <Screen>
            <Group>
                <Tags title="Content" tags={{ ...contentRegion }} border vertical />
                <Tags title="Screen" tags={{ ...screenRegion }} border vertical />
            </Group>
        </Screen>
    </>;
}

ListEditor.State = createState("ListEditor.State");
