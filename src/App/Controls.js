import Window from "src/UI/Window";
import { useMemo } from "react";
import { MdOutlineWidgets } from "react-icons/md";

export default function Controls() {
    const icon = useMemo(() => <MdOutlineWidgets />, []);

    return <>
        <Window.Rect left={900} top={200} width={300} height={300} />
        <Window icon={icon} label="Controls" accentBackground="purple">
        </Window>
    </>;
}
