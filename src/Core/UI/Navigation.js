import { useCallback, useEffect } from "react";
import { getClientWindow } from "../Util/Client";
import { useEventListener } from "./EventListener";
import { createState } from "../Base/State";
import Apps from "./Apps";
import Screen from "src/UI/Screen";

function Navigation() {
    const screen = getClientWindow();
    const screenManager = Screen.Manager.useManager();
    const apps = Apps.State.useState();
    const current = screenManager.current;
    const navigation = Navigation.State.useState();

    useEffect(() => {
        navigation(state => {
            state.hash = screen?.location?.hash;
        });
    }, [navigation, screen]);

    const onHashChange = useCallback(() => {
        navigation(state => {
            state.hash = screen?.location?.hash;
        });
    }, [navigation, screen]);
    useEventListener(screen, "hashchange", onHashChange);

    useEffect(() => {
        window.location.hash = navigation.hash;
        const segments = navigation.hash?.replace("#", "").split("/") || [];
        const appId = segments[0], screenId = segments[1] || segments[0];
        apps(state => {
            if (appId) {
                state.appId = appId;
            }
        });
        screenManager(state => {
            if (screenId) {
                state.forceFocusId = screenId;
                state.focusId = screenId;
            }
        });
    }, [navigation.hash, screen?.location, screenManager, apps]);

    useEffect(() => {
        if (!current) {
            return;
        }
        const appId = current.appId || current.id;
        const screenId = current.id;
        let hash = "";
        if (screenId === appId) {
            hash = appId;
        }
        else {
            hash = `${appId}/${screenId}`;
        }
        navigation(state => {
            state.hash = hash;
        });
    }, [navigation, current]);
}

Navigation.State = createState("Navigation.State");

export default Navigation;
