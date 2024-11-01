import { useCallback } from "react";

/**
 * Hook that generates a function that maps a variable number of strings, arrays
 * of strings, or objects to their corresponding CSS classes from a given style
 * object.
 * 
 * The function takes in a variable number of arguments. Each argument can be a
 * string, an array of strings, or an object. The function will return a string
 * that contains the concatenation of all the corresponding CSS classes from
 * the given style object.
 * 
 * If the argument is a string, it is used directly as the key to the style
 * object.
 * 
 * If the argument is an array of strings, the array is filtered for truthy
 * values and then mapped to the corresponding CSS classes from the style
 * object, which are then joined together with spaces.
 * 
 * If the argument is an object, the object is filtered for truthy values, the
 * keys of the filtered object are mapped to the corresponding CSS classes from
 * the style object, which are then joined together with spaces.
 * 
 * The final result is a string that is the concatenation of all the CSS classes
 * from all the arguments.
 * 
 * The function memoizes the style object, so that it is only recreated when the
 * style object changes.
 */
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
