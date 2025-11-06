import Screen from "src/UI/Screen";
import { useCallback, useMemo } from "react";
import { MdOutlineWidgets } from "react-icons/md";
import Button from "src/UI/Widgets/Button";
import ColorScheme from "src/Core/UI/ColorScheme";
import Group from "src/UI/Widgets/Group";
import Lang from "src/Core/UI/Lang";
import Resources from "src/Core/UI/Resources";
import ThemeToggleButton from "./Controls/ThemeToggleButton";
import resources from "./Controls.res";

export default function Controls() {
    const lookup = Resources.useLookup();
    const icon = useMemo(() => <MdOutlineWidgets />, []);
    const colorSceme = ColorScheme.State.useState();
    const isDarkMode = colorSceme.theme === "dark";
    const onToggleTheme = useCallback(() => {
        colorSceme.toggle();
    }, [colorSceme]);
    const lang = Lang.State.useState();
    const onToggleLanguage = useCallback(() => {
        const id = lang.id === "heb" ? "eng" : "heb";
        lang(state => {
            state.id = id;
            state.direction = Lang.getDirection(id);
        });
    }, [lang]);

    return <Resources resources={resources} lookup={lookup}>
        <Screen.Rect left={500} top={200} width={300} height={300} />
        <Screen.State icon={icon} id="controls" label={lookup?.TITLE} assetColor="purple" />
        <Screen>
            <Group>
                <ThemeToggleButton isDarkMode={isDarkMode} onClick={onToggleTheme}>{lookup?.TOGGLE_THEME}</ThemeToggleButton>
            </Group>
            <Group>
                <Button selected={lang.id === "heb"} onClick={onToggleLanguage}>{lookup?.LANGAUGE}</Button>
            </Group>
        </Screen>
    </Resources>;
}
