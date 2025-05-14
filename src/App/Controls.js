import Screen from "src/UI/Screen";
import { useCallback, useMemo } from "react";
import { MdOutlineWidgets } from "react-icons/md";
import Button from "src/UI/Widgets/Button";
import ColorScheme from "src/Core/UI/ColorScheme";
import Group from "src/UI/Widgets/Group";
import Lang from "src/Core/UI/Lang";
import Resources from "src/Core/UI/Resources";
import resources from "./Controls/Resources";

export default function Controls() {
    const lookup = Resources.useLookup();
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

    return <Resources resources={resources} lookup={lookup}>
        <Screen.Rect left={900} top={200} width={300} height={300} />
        <Screen.State icon={icon} id="controls" label={lookup?.TITLE} accentBackground="purple" />
        <Screen>
            <Group>
                <Button selected={selected} onClick={onToggleTheme}>{lookup?.TOGGLE_THEME}</Button>
            </Group>
            <Group>
                <Button selected={selected} onClick={onToggleLanguage}>{lookup?.LANGAUGE}</Button>
            </Group>
        </Screen>
    </Resources>;
}
