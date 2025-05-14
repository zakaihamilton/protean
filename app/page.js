'use client'

import Node from "src/Core/Base/Node"
import Logger from "src/Core/Util/Logger"
import Lang from "src/Core/UI/Lang"
import ColorScheme from "src/Core/UI/ColorScheme"
import Navigation from "src/Core/UI/Navigation"
import Screen from "src/UI/Screen"
import Desktop from "src/UI/Desktop"
import Apps from "src/Core/UI/Apps"
import Launcher from "src/App/Launcher"
import { ManagerUser } from "src/Manager/User"

export default function Page({ children }) {
    return <Node>
        <Logger />
        <Lang id="eng">
            <ColorScheme />
            <Navigation />
            <ManagerUser />
            <Screen.Manager>
                <Desktop>
                    <Apps />
                    <Node>
                        <Launcher />
                    </Node>
                    {children}
                </Desktop>
            </Screen.Manager>
        </Lang>
    </Node>
}
