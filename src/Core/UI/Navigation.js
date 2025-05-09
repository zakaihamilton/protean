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
        navigation.hash = screen?.location?.hash;
    }, [navigation, screen]);

    const onHashChange = useCallback(() => {
        navigation.hash = screen?.location?.hash;
    }, [navigation, screen]);
    useEventListener(screen, "hashchange", onHashChange);

    useEffect(() => {
        window.location.hash = navigation.hash;
        const segments = navigation.hash?.replace("#", "").split("/") || [];
        const appId = segments[0], screenId = segments[1] || segments[0];
        if (appId) {
            apps.appId = appId;
        }
        if (screenId) {
            screenManager.forceFocusId = screenId;
            screenManager.focusId = screenId;
        }
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
        navigation.hash = hash;
    }, [navigation, current]);
}

Navigation.State = createState("Navigation.State");

export default Navigation;
