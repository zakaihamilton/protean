'use client'

import Node from "src/Core/Base/Node"
import Theme from "src/Core/UI/Theme"
import Button from "src/UI/Widgets/Button"
import Group from "src/UI/Widgets/Group"

import "src/Theme/Glow"
import Window from "src/UI/Window"
import Windows from "src/UI/Windows"
import Desktop from "src/UI/Desktop"
import { read, write } from "src/Core/Service/Redis"
import { createState } from "src/Core/Base/State"
import { useEffect } from "react"

export default function Page({ children }) {
    const state = Page.State.useDynamicState();

    useEffect(() => {
        state.counter = 0;
    }, [state]);

    useEffect(() => {
        state.data = read();
    }, [state, state.counter]);

    return <Theme name="glow">
        <Windows>
            <Desktop>
                <Node>
                    <Window.Region width={500} height={500} />
                    <Window label="One" fixed center accentColor="red">
                        <Group>
                            <Button label="Write" border={true} onClick={() => write()} />
                            <Button label="Read" border={true} onClick={() => state.counter++} />
                            {state.data}
                        </Group>
                    </Window>
                </Node>
                <Node>
                    <Window.Region left={250} top={200} width={500} height={500} />
                    <Window label="Two" accentColor="green">
                        <Group>
                        </Group>
                    </Window>
                </Node>
                {children}
            </Desktop>
        </Windows>
    </Theme>;
}

Page.State = createState("Page.State");