import Head from 'next/head'
import Node from "src/Core/Base/Node"
import Screen from "src/UI/Screen"
import Collapse from "src/UI/Screen/Collapse"
import Theme from "src/UI/Util/Theme"
import Button from "src/UI/Widgets/Button"
import Group from "src/UI/Widgets/Group"

import "src/Theme/Glow"
import Window from "src/UI/Window"
import Region from "src/UI/Util/Region"

export default function Home() {
  return (
    <>
      <Head>
        <title>Protean</title>
        <meta name="description" content="Protean" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Theme name="glow">
        <Node>
          <Region left={100} top={100} width={500} height={500} />
          <Window label="My Window">
            <Group>
              <Button label="Button" border={true} />
            </Group>
          </Window>
          <Screen name="second">
            <Collapse />
          </Screen>
        </Node>
        <Node>
          <Region left={100} top={100} width={500} height={500} />
          <Window label="My Window">
            <Group>
              <Button label="Button" border={true} />
            </Group>
          </Window>
        </Node>
      </Theme>
    </>
  )
}
