import '../styles/globals.css'

export const metadata = {
    title: 'Protean',
    description: 'Protean'
}

export default function Layout({ children }) {
    return <html lang="en">
        <body>
            {children}
        </body>
    </html>
}