import { useMemo } from "react";
import WindowMenu from "src/UI/Window/Menu";
import ListEditor from "../ListEditor";
import Storage from "./Storage";

export default function Menu() {
    const listEditor = ListEditor.State.useState();
    const storage = listEditor.storage;
    const items = useMemo(() => {
        return [
            {
                id: "storage",
                label: "Storage",
                items: Storage.map(item => {
                    return {
                        id: item.id,
                        label: item.label,
                        check: storage === item.Component,
                        onClick: () => {
                            listEditor.storage = item.Component;
                            return true;
                        }
                    };
                })
            }
        ];
    }, [listEditor, storage]);
    return <WindowMenu.State visible={true} items={items} />;
}
