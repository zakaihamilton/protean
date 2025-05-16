import { useEffect, useMemo } from "react";
import { createState } from "../Base/State";
import Lang from "./Lang";
import Node from "../Base/Node";

export default function Resources({ resources, lookup, children }) {
    const parent = Resources.State.usePassiveState();
    return <Node>
        <Resources.State resources={resources} parent={parent}>
            <Resources.Lookup lookup={lookup}>
                {children}
            </Resources.Lookup>
        </Resources.State>
    </Node>;
}

Resources.State = createState("Resources.State");
Resources.useLookup = () => {
    const lang = Lang.State.useState();
    const proxy = useMemo(() => {
        return new Proxy({}, {
            get: (target, property) => {
                if (property === "resources") {
                    return target?.resources;
                }
                if (!target?.resources) {
                    return property;
                }
                let parent = target.resources;
                do {
                    const resources = parent?.resources;
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

Resources.Lookup = function Lookup({ lookup, children }) {
    const resources = Resources.State.useState();
    useEffect(() => {
        if (lookup) {
            lookup.resources = resources;
            resources.ready = true;
        }
    }, [lookup, resources]);

    if (!resources.ready) {
        return null;
    }

    return children;
};
