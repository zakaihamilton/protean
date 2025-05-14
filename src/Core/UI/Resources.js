import { useEffect, useMemo } from "react";
import { createState } from "../Base/State";
import Lang from "./Lang";

export default function Resources({ resources, lookup, children }) {
    const parent = Resources.State.usePassiveState();
    return <Resources.State resources={resources} parent={parent}>
        <Resources.Lookup lookup={lookup} />
        {children}
    </Resources.State>;
}

Resources.State = createState("Resources.State");
Resources.useLookup = () => {
    const lang = Lang.State.useState();
    const proxy = useMemo(() => {
        return new Proxy({}, {
            get: (target, property) => {
                let parent = target.target;
                console.log("parent", parent, "property", property, "lang?.id", lang?.id);
                do {
                    const resources = parent?.resources;
                    console.log("resources", resources);
                    const value = resources?.[property]?.[lang?.id];
                    if (value) {
                        return value;
                    }
                    parent = parent?.parent;
                } while (parent);
                return property;
            }
        });
    }, [lang]);
    return proxy;
};

Resources.Lookup = function Lookup({ lookup }) {
    const resources = Resources.State.useState();
    useEffect(() => {
        if (lookup) {
            lookup.target = resources;
        }
    }, [lookup, resources]);
    return null;
};
