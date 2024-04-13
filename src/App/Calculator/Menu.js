import { useMemo } from "react";
import WindowMenu from "src/UI/Window/Menu";
import ListEditor from "../ListEditor";

export default function Menu() {
    const listEditor = ListEditor.State.useState();
    const items = useMemo(() => {
        return [
        ];
    }, []);
    return <WindowMenu.State visible={false} items={items} />;
}
