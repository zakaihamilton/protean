import { useMemo } from "react";
import WindowMenu from "src/UI/Window/Menu";
import ListEditor from "../ListEditor";
import Storage from "./Storage";

export default function Menu() {
    const listEditor = ListEditor.State.useState();
    const items = useMemo(() => {
        return [
            {
                id: "storage",
                label: "Storage",
                items: Storage.map(item => {
                    return {
                        id: item.id,
                        label: item.label,
                        check: listEditor.storage === item.Component,
                        onClick: () => {
                            listEditor.storage = item.Component;
                        }
                    };
                })
            }
        ];
    }, [listEditor]);
    return <WindowMenu.State visible={true} items={items} />;
}
