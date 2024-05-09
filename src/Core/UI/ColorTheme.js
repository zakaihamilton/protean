import { useCallback, useEffect } from "react";
import { createState } from "../Base/State";
import { useEventListener } from "./EventListener";
import { getClientWindow } from "../Util/Client";

function prefersColorScheme() {
    const window = getClientWindow();
    return window?.matchMedia('(prefers-color-scheme: dark)')?.matches ? "dark" : "light";
}

function ColorTheme() {
    const window = getClientWindow();
    const colorTheme = ColorTheme.State.useState();
    const defaultColorTheme = prefersColorScheme();

    useEffect(() => {
        let root = document.querySelector(":root");
        if (colorTheme.theme === "light") {
            root.classList.remove('dark');
        }
        else if (colorTheme.theme === "dark") {
            root.classList.add('dark');
        }
    }, [colorTheme.theme]);

    const onColorSchemeChange = useCallback(() => {
        colorTheme.theme = prefersColorScheme();
    }, [colorTheme]);

    useEventListener(window?.matchMedia('(prefers-color-scheme: dark)'), "change", onColorSchemeChange);

    useEffect(() => {
        colorTheme.theme = defaultColorTheme;
    }, [colorTheme, defaultColorTheme]);

    const toggle = useCallback(() => {
        colorTheme.theme = colorTheme.theme === "light" ? "dark" : "light";
    }, [colorTheme]);

    return <ColorTheme.State toggle={toggle} theme={defaultColorTheme} />;
}

ColorTheme.State = createState("ColorTheme");

export default ColorTheme;
