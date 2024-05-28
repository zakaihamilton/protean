import { useCallback, useEffect, useMemo } from "react";
import { getClientWindow } from "../Util/Client";
import { useEventListener } from "./EventListener";
import { createState } from "../Base/State";
import Windows from "src/Core/UI/Windows";
import Apps from "./Apps";

function Navigation() {
    const window = getClientWindow();
    const windows = Windows.State.useState();
    const apps = Apps.State.useState();
    const current = windows.current;
    const initial = useMemo(() => {
        const hash = window?.location?.hash;
        return {
            hash
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const navigation = Navigation.State.useState({ initial });

    const onHashChange = useCallback(() => {
        navigation.hash = window?.location?.hash;
    }, [navigation, window]);
    useEventListener(window, "hashchange", onHashChange);

    useEffect(() => {
        window.location.hash = navigation.hash;
        const segments = navigation.hash.replace("#", "").split("/");
        const appId = segments[0], windowsId = segments[1] || segments[0];
        if (appId) {
            apps.appId = appId;
        }
        if (windowsId) {
            windows.forceFocusId = windowsId;
            windows.updateFocus();
        }
    }, [navigation.hash, window?.location, windows, apps]);

    useEffect(() => {
        if (!current) {
            return;
        }
        const appId = current.appId || current.id;
        const windowsId = current.id;
        let hash = "";
        if (windowsId === appId) {
            hash = appId;
        }
        else {
            hash = `${appId}/${windowsId}`;
        }
        navigation.hash = hash;
    }, [navigation, current]);
}

Navigation.State = createState("Navigation.State");

export default Navigation;
