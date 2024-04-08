'use client'

import Node from "src/Core/Base/Node"
import Theme from "src/Core/UI/Theme"
import Button from "src/UI/Widgets/Button"
import Group from "src/UI/Widgets/Group"

import "src/Theme/Glow"
import Window from "src/UI/Window"
import Windows from "src/UI/Windows"
import Desktop from "src/UI/Desktop"
import { createState } from "src/Core/Base/State"
import { useEffect } from "react"
import Tooltip from "src/UI/Widgets/Tooltip"

export default function Page({ children }) {
    const state = Page.State.useState();

    useEffect(() => {
        state.counter = 0;
    }, [state]);

    return <Theme name="glow">
        <Windows>
            <Desktop>
                <Node>
                    <Window.Region width={500} height={500} />
                    <Window label="One" fixed center accentColor="red">
                        <Group>
                        </Group>
                    </Window>
                </Node>
                <Node>
                    <Window.Region left={250} top={200} width={500} height={500} />
                    <Window label="Two" accentColor="green">
                        <Group>
                            <Tooltip label="This is a tooltip">
                                <Button label="This is a button" border={true} />
                            </Tooltip>
                            <Tooltip label="This is a another tooltip">
                                <Button label="This is another button" border={true} />
                            </Tooltip>
                        </Group>
                    </Window>
                </Node>
                {children}
            </Desktop>
        </Windows>
    </Theme>;
}

Page.State = createState("Page.State");