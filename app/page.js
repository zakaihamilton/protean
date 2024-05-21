'use client'

import Theme from "src/Core/UI/Theme"
import Windows from "src/UI/Windows"
import Desktop from "src/UI/Desktop"
import App from "src/App"
import ColorScheme from "src/Core/UI/ColorScheme"
import Logger from "src/Core/Base/Logger"
import Node from "src/Core/Base/Node"

import "src/Theme/Glow"
import Navigation from "src/Core/UI/Navigation"

export default function Page({ children }) {
    return <Node>
        <Logger />
        <Theme name="glow" />
        <ColorScheme />
        <Navigation />
        <Windows>
            <Desktop>
                <App />
                {children}
            </Desktop>
        </Windows>
    </Node>
}
