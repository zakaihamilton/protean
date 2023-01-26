import React, { useCallback } from "react";
import { useElement, useElementConstructor } from "src/Core/Base/Element";
import { createEvents } from "src/Core/Base/Events";
import { useWindow } from "src/Core/Base/Window";

function useConsoleRender() {
    const render = useCallback(() => {

    }, []);
    Console.Events.useEvent("resize", render);
    return render;
}

function useConsoleConstructor(element) {
    const constructor = useCallback(() => {
        return () => {
        };
    }, []);
    useElementConstructor(element, constructor);
}

export default function Console({ children, ...props }) {
    const element = useElement();
    const events = Console.Events.useDynamicState();
    const render = useConsoleRender();
    useConsoleConstructor(element);

    const window = useWindow();
    Console.Events.useEventsAsListeners(window);

    return <canvas ref={element} {...props} />;
}

Console.Events = createEvents();
