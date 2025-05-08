import { useMemo } from "react";
import ScreenMenu from "src/UI/Screen/Menu";
import ListEditor from "../ListEditor";
import Storage from "./Storage";
import Item from "src/UI/Screen/Menu/Item";

export default function Menu() {
    const listEditor = ListEditor.State.useState();
    const storage = listEditor.storage;
    const storageItems = useMemo(() => {
        return Storage.map(item => {
            const onClick = () => {
                listEditor.storage = item.Component;
                return true;
            }
            return <Item
                key={item.id}
                id={item.id}
                label={item.label}
                checked={storage === item.Component}
                onClick={onClick} />;
        });
    }, [listEditor, storage]);
    const items = useMemo(() => {
        return <Item key="storage" id="storage" label="Storage">
            {storageItems}
        </Item>;
    }, [storageItems]);
    return <ScreenMenu.State visible={true} items={items} />;
}
