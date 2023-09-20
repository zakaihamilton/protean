import { createState } from "src/Core/Base/State";
import { filterObjectByKeys } from "./Object";
import Node from "./Node";

export function withExtension(Component, Extension, propKeys = []) {
    if (!Component) {
        throw new Error("Component is required");
    }
    if (!Extension) {
        throw new Error("Extension is required");
    }
    const displayName = Component.displayName || Component.name || "";
    const State = Component.State = createState(displayName + ".State");
    function WrappedExtension({ children, ...props }) {
        const [extensionProps, componentProps] = filterObjectByKeys(props, propKeys);
        return <Node id={displayName}>
            <State {...extensionProps} />
            <Extension>
                <Component {...componentProps}>
                    {children}
                </Component>
            </Extension>
        </Node>;
    }
    Object.setPrototypeOf(WrappedExtension, Component);
    return WrappedExtension;
}
