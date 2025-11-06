import { useEffect, useMemo } from "react";
import { createState } from "../Base/State";
import SupportedApps from "src/Apps";
import App from "./Apps/App";
import Node from "../Base/Node";
import Screen from "src/UI/Screen";

export default function Apps() {
    const apps = Apps.State.useState();
    const screenManager = Screen.Manager.useManager();
    useEffect(() => {
        if (!apps.appId && apps.relaunchCounter === undefined) {
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
            screenId = screenManager?.forceFocusId;
            if (!screenId) {
                screenId = screenManager?.list?.toReversed()?.find(item => item.appId === id)?.id;
            }
            if (!screenId) {
                screenId = screenManager?.closed?.toReversed()?.find(item => item.appId === id)?.id;
            }
            if (!screenId) {
                screenId = id;
            }
            {
                const screen = screenManager?.closed?.find(item => item.id === screenId);
                if (screen) {
                    screen.close = false;
                }
            }
            {
                const screen = screenManager?.list?.find(item => item.id === screenId);
                if (screen) {
                    screen.minimize = false;
                }
            }
        }
        else if (Component) {
            apps(state => {
                state.list = [...state.list || [], { id, Component }];
            });
        }
        if (id === screenId) {
            window.location.hash = `#${id}`;
        }
        else {
            window.location.hash = `#${id}/${screenId}`;
        }
    }, [apps, apps.appId, apps.relaunchCounter, screenManager]);

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
