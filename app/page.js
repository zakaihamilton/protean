'use client'

import Windows from "src/Core/UI/Windows"
import Desktop from "src/UI/Desktop"
import ColorScheme from "src/Core/UI/ColorScheme"
import Logger from "src/Core/Util/Logger"
import Node from "src/Core/Base/Node"

import Navigation from "src/Core/UI/Navigation"
import Apps from "src/Core/UI/Apps"
import Launcher from "src/App/Launcher"
import Lang from "src/Core/UI/Lang"

export default function Page({ children }) {
    return <Node>
        <Logger />
        <Lang />
        <ColorScheme />
        <Navigation />
        <Windows>
            <Desktop>
                <Apps />
                <Node>
                    <Launcher />
                </Node>
                {children}
            </Desktop>
        </Windows>
    </Node>
}
