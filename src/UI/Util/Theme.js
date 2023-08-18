import Node from "src/Core/Base/Node";
import { withState } from "src/Core/Base/State";

function Theme({ children }) {
    const theme = Theme.State.useState();

    console.log("theme", theme?.name);

    return children;
}

export function extendTheme(Component, name, ThemedComponent) {
    if (!Component) {
        throw new Error("Component is required");
    }
    if (!Component.themes) {
        throw new Error("Component is not themed");
    }
    Component.themes[name] = ThemedComponent;
}

export function withTheme(Component) {
    const displayName = Component.displayName || Component.name || "";
    if (!Component) {
        throw new Error("Component is required");
    }
    Component.themes = {};
    function WrappedTheme({ children, ...props }) {
        const theme = Theme.State.useState();
        const ThemedComponent = Component.themes[theme?.name] || Component;
        return <ThemedComponent {...props}>
            {children}
        </ThemedComponent>;
    }
    Object.setPrototypeOf(WrappedTheme, Component);
    return WrappedTheme;
}

export default withState(Theme);
