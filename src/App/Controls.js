import Window from "src/UI/Window";
import { useCallback, useMemo } from "react";
import { MdOutlineWidgets } from "react-icons/md";
import Button from "src/UI/Widgets/Button";
import ColorTheme from "src/Core/UI/ColorTheme";
import Group from "src/UI/Widgets/Group";

export default function Controls() {
    const icon = useMemo(() => <MdOutlineWidgets />, []);
    const colorTheme = ColorTheme.State.useState();
    const selected = colorTheme.theme === "dark";
    const onToggleTheme = useCallback(() => {
        colorTheme.toggle();
    }, [colorTheme]);

    return <>
        <Window.Rect left={900} top={200} width={300} height={300} />
        <Window icon={icon} label="Controls" accentBackground="purple">
            <Group>
                <Button selected={selected} onClick={onToggleTheme}>Toggle Dark Theme</Button>
            </Group>
        </Window>
    </>;
}
