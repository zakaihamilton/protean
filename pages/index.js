import Head from 'next/head'
import Console from "src/App/Console"
import Node from "src/Core/Base/Node"

export default function Home() {
  return (
    <>
      <Head>
        <title>Protean</title>
        <meta name="description" content="Protean OS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Node>
        <Console />
      </Node>
    </>
  )
}
