'use client'

import Node from "src/Core/Base/Node"
import Theme from "src/Core/UI/Theme"
import Button from "src/UI/Widgets/Button"
import Group from "src/UI/Widgets/Group"

import "src/Theme/Glow"
import Window from "src/UI/Window"
import Windows from "src/UI/Windows"
import Desktop from "src/UI/Desktop"

export default function Page({ children }) {
    return <Theme name="glow">
        <Windows>
            <Desktop>
                <Node>
                    <Window.Region width={500} height={500} />
                    <Window label="One" fixed center accentColor="red">
                        <Group>
                            <Button label="Button" border={true} />
                        </Group>
                    </Window>
                </Node>
                <Node>
                    <Window.Region left={250} top={200} width={500} height={500} />
                    <Window label="Two" accentColor="green">
                        <Group>
                            <Button label="Button" border={true} />
                        </Group>
                    </Window>
                </Node>
                {children}
            </Desktop>
        </Windows>
    </Theme>;
}