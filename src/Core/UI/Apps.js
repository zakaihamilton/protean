import { useCallback, useEffect, useMemo } from "react";
import { createState } from "../Base/State";
import Windows from "./Windows";
import Node from "../Base/Node";
import SupportedApps from "src/Apps";

export default function Apps() {
    const apps = Apps.State.useState();
    const windows = Windows.State.useState();
    const launch = useCallback(({ id, Component }) => {
        const exists = apps.list?.find(item => item.id === id);
        if (exists) {
            const window = windows?.closed?.find(item => item.id === id);
            if (window) {
                window.close = false;
            }
        }
        else {
            apps.list = [...apps.list || [], { id, Component }];
        }
        windows.updateFocus(id);
    }, [apps, windows]);
    useEffect(() => {
        if (windows.forceFocusId) {
            const app = SupportedApps.find(item => item.id === windows.forceFocusId);
            if (app) {
                launch(app);
            }
        }
    }, [windows.forceFocusId, launch]);
    const activeApps = useMemo(() => {
        return apps.list?.map(({ Component, id }) => {
            return <Node key={id}>
                <Component />
            </Node>
        });
    }, [apps.list]);
    return <>
        <Apps.State launch={launch} />
        {activeApps}
    </>;
}

Apps.State = createState("Apps.State");
