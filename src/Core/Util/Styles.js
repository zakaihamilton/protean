import { useCallback } from "react";

export function useClasses(styles) {
    const classes = useCallback((...props) => {
        return props.filter(Boolean).map(name => {
            if (typeof name === "string") {
                return styles[name];
            }
            else if (Array.isArray(name)) {
                return name.filter(key => key).map(key => styles[key]).join(" ");
            }
            else if (typeof name === "object") {
                return Object.keys(name).filter(key => name[key]).map(key => styles[key]).join(" ");
            }
        }).join(" ");
    }, [styles]);

    return classes;
}
