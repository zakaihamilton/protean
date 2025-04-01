import { useCallback, useEffect } from "react";
import { createState } from "../Base/State";
import { useEventListener } from "./EventListener";
import { getClientWindow } from "../Util/Client";
import { createConsole } from "../Base/Console";

const console = createConsole("ColorScheme");

function prefersColorScheme() {
    const window = getClientWindow();
    return window?.matchMedia('(prefers-color-scheme: dark)')?.matches ? "dark" : "light";
}

function ColorScheme() {
    const window = getClientWindow();
    const defaultColorScheme = prefersColorScheme();
    const colorScheme = ColorScheme.State.useState();

    useEffect(() => {
        colorScheme.theme = defaultColorScheme;
    }, [colorScheme, defaultColorScheme]);

    useEffect(() => {
        let root = document.querySelector(":root");
        if (colorScheme.theme === "light") {
            root.classList.remove('dark');
        }
        else if (colorScheme.theme === "dark") {
            root.classList.add('dark');
        }
    }, [colorScheme.theme]);

    const onColorSchemeChange = useCallback(() => {
        colorScheme.theme = prefersColorScheme();
    }, [colorScheme]);

    useEventListener(window?.matchMedia('(prefers-color-scheme: dark)'), "change", onColorSchemeChange);

    const toggle = useCallback(() => {
        colorScheme.theme = colorScheme.theme === "light" ? "dark" : "light";
    }, [colorScheme]);

    useEffect(() => {
        console.log("theme changed:", colorScheme.theme);
    }, [colorScheme.theme]);

    return <ColorScheme.State toggle={toggle} />;
}

ColorScheme.State = createState("ColorScheme.State");

export default ColorScheme;
