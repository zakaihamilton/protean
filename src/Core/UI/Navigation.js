import { useCallback, useEffect, useMemo } from "react";
import { getClientWindow } from "../Util/Client";
import { useEventListener } from "./EventListener";
import { createState } from "../Base/State";
import Windows from "src/Core/UI/Windows";

function Navigation() {
    const window = getClientWindow();
    const windows = Windows.State.useState();
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
        const rootId = navigation.hash.replace("#", "").split("/")[0];
        if (rootId) {
            windows.forceFocusId = rootId;
            windows.updateFocus();
        }
    }, [navigation.hash, window?.location, windows]);

    useEffect(() => {
        if (!current) {
            return;
        }
        navigation.hash = current?.id || "";
    }, [navigation, current]);
}

Navigation.State = createState("Navigation.State");

export default Navigation;
