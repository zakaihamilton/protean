'use client'

import Theme from "src/Core/UI/Theme"
import Windows from "src/Core/UI/Windows"
import Desktop from "src/UI/Desktop"
import ColorScheme from "src/Core/UI/ColorScheme"
import Logger from "src/Core/Base/Logger"
import Node from "src/Core/Base/Node"

import "src/Theme/Glow"
import Navigation from "src/Core/UI/Navigation"
import Apps from "src/Core/UI/Apps"
import Launcher from "src/App/Launcher"
import Lang from "src/Core/UI/Lang"

export default function Page({ children }) {
    return <Node>
        <Logger />
        <Theme name="glow" />
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
