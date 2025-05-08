import { useEffect, useMemo } from "react";
import { createState } from "../Base/State";
import Screens from "./Screens";
import SupportedApps from "src/Apps";
import App from "./Apps/App";
import Node from "../Base/Node";

export default function Apps() {
    const apps = Apps.State.useState();
    const screens = Screens.State.useState();
    useEffect(() => {
        if (!apps.appId) {
            return;
        }
        const app = SupportedApps.find(item => item.id === apps.appId);
        const { id, Component } = app || {};
        if (!id) {
            return;
        }
        const exists = apps.list?.find(item => item.id === id);
        let screenId = id;
        if (exists) {
            screenId = screens?.forceFocusId;
            if (!screenId) {
                screenId = screens?.list?.toReversed()?.find(item => item.appId === id)?.id;
            }
            if (!screenId) {
                screenId = screens?.closed?.toReversed()?.find(item => item.appId === id)?.id;
            }
            if (!screenId) {
                screenId = id;
            }
            {
                const screen = screens?.closed?.find(item => item.id === screenId);
                if (screen) {
                    screen.close = false;
                }
            }
            {
                const screen = screens?.list?.find(item => item.id === screenId);
                if (screen) {
                    screen.minimize = false;
                }
            }
        }
        else if (Component) {
            apps.list = [...apps.list || [], { id, Component }];
        }
        if (id === screenId) {
            window.location.hash = `#${id}`;
        }
        else {
            window.location.hash = `#${id}/${screenId}`;
        }
    }, [apps, apps.appId, screens]);
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
        <Apps.State />
        {activeApps}
    </>;
}

Apps.State = createState("Apps.State");
