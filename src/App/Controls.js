import Window from "src/UI/Window";
import { useCallback, useMemo } from "react";
import { MdOutlineWidgets } from "react-icons/md";
import Button from "src/UI/Widgets/Button";
import ColorScheme from "src/Core/UI/ColorScheme";
import Group from "src/UI/Widgets/Group";
import Lang from "src/Core/UI/Lang";
import Node from "src/Core/Base/Node";

export default function Controls() {
    const icon = useMemo(() => <MdOutlineWidgets />, []);
    const colorSceme = ColorScheme.State.useState();
    const selected = colorSceme.theme === "dark";
    const onToggleTheme = useCallback(() => {
        colorSceme.toggle();
    }, [colorSceme]);
    const lang = Lang.State.useState();
    const onToggleLanguage = useCallback(() => {
        lang.id = lang.id === "heb" ? "eng" : "heb";
    }, [lang]);

    const text = Lang.useText();

    return <Node>
        <Window.Rect left={900} top={200} width={300} height={300} />
        <Window icon={icon} id="controls" label="Controls" accentBackground="purple">
            <Group>
                <Button selected={selected} onClick={onToggleTheme}>Toggle Dark Theme</Button>
            </Group>
            <Group>
                <Button selected={selected} onClick={onToggleLanguage}>{text?.LANGAUGE}</Button>
            </Group>
        </Window>
    </Node>;
}
