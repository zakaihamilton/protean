import { useCallback } from "react";
import { withState } from "src/Core/Base/State";

function Theme({ children }) {
    const theme = Theme.State.useState();

    console.log("theme", theme?.name);

    return children;
}

export function replaceTheme(Component, name, ThemedComponent) {
    if (!Component) {
        throw new Error("Component is required");
    }
    if (!Component.themes) {
        throw new Error("Component is not themed");
    }
    if (!name) {
        throw new Error("name is required");
    }
    const list = Array.isArray(name) ? name : [name];
    for (const name of list) {
        Component.themes[name] = ThemedComponent;
    }
}

export function withTheme(Component) {
    if (!Component) {
        throw new Error("Component is required");
    }
    Component.themes = {};
    function WrappedTheme({ children, ...props }) {
        const theme = Theme.State.useState();
        const findThemedComponent = useCallback(() => {
            const list = Array.isArray(theme?.name) ? theme.name : [theme?.name];
            const name = list.find(name => {
                return Component.themes[name];
            });
            return Component.themes[name];
        }, [theme.name]);
        const ThemedComponent = findThemedComponent() || Component;
        return <ThemedComponent {...props}>
            {children}
        </ThemedComponent>;
    }
    Object.setPrototypeOf(WrappedTheme, Component);
    return WrappedTheme;
}

export default withState(Theme);
