'use client'

import Node from "src/Core/Base/Node"
import Theme from "src/Core/UI/Theme"

import "src/Theme/Glow"
import Windows from "src/UI/Windows"
import Desktop from "src/UI/Desktop"
import ListEditor from "src/App/ListEditor"

export default function Page({ children }) {
    return <Theme name="glow">
        <Windows>
            <Desktop>
                <Node>
                    <ListEditor />
                </Node>
                {children}
            </Desktop>
        </Windows>
    </Theme>;
}
