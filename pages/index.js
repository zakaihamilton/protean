import Head from 'next/head'
import Node from "src/Core/Base/Node"
import Theme from "src/Core/UI/Theme"
import Button from "src/UI/Widgets/Button"
import Group from "src/UI/Widgets/Group"

import "src/Theme/Glow"
import Window from "src/UI/Window"
import Windows from "src/UI/Windows"
import Desktop from "src/UI/Desktop"
import useConfig from "src/Core/Base/Config"

export default function Home() {
  const config = useConfig();
  return (
    <>
      <Head>
        <title>Protean</title>
        <meta name="description" content="Protean" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Theme name="glow">
        <Windows>
          <Desktop>
            <Node>
              <Window.Region width={500} height={500} />
              <Window label="One" fixed center accentColor="red">
                <Group>
                  <Button label={config.version} border={true} />
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
          </Desktop>
        </Windows>
      </Theme>
    </>
  )
}
