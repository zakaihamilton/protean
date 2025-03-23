import { useCallback, useEffect, useMemo } from "react";
import { createState } from "../Base/State";
import Windows from "./Windows";
import SupportedApps from "src/Apps";
import App from "./Apps/App";
import Node from "../Base/Node";

export default function Apps() {
    const apps = Apps.State.useState();
    const windows = Windows.State.useState();
    const launch = useCallback(({ id, Component }) => {
        if (!id) {
            return;
        }
        const exists = apps.list?.find(item => item.id === id);
        if (exists) {
            let windowId = windows?.forceFocusId;
            if (!windowId) {
                windowId = windows?.list?.toReversed()?.find(item => item.appId === id)?.id;
            }
            if (!windowId) {
                windowId = windows?.closed?.toReversed()?.find(item => item.appId === id)?.id;
            }
            if (!windowId) {
                windowId = id;
            }
            const window = windows?.closed?.find(item => item.id === windowId);
            if (window) {
                window.close = false;
            }
            windows.focusId = windowId;
        }
        else if (Component) {
            apps.list = [...apps.list || [], { id, Component }];
        }
    }, [apps, windows]);
    useEffect(() => {
        if (apps.appId) {
            const app = SupportedApps.find(item => item.id === apps.appId);
            if (app) {
                launch(app);
            }
        }
    }, [apps.appId, launch]);
    const activeApps = useMemo(() => {
        return apps.list?.map(({ Component, id }) => {
            return <Node key={id}>
                <App id={id}>
                    <Component />
                </App>
            </Node>;
        });
    }, [apps.list]);
    return <>
        <Apps.State launch={launch} />
        {activeApps}
    </>;
}

Apps.State = createState("Apps.State");
