'use client'

import Theme from "src/Core/UI/Theme"

import "src/Theme/Glow"
import Windows from "src/UI/Windows"
import Desktop from "src/UI/Desktop"
import App from "src/App"

export default function Page({ children }) {
    return <Theme name="glow">
        <Windows>
            <Desktop>
                <App />
                {children}
            </Desktop>
        </Windows>
    </Theme>;
}
