'use client';

import Launcher from 'src/App/Launcher';
import Node from 'src/Core/Base/Node';
import Apps from 'src/Core/UI/Apps';
import ColorScheme from 'src/Core/UI/ColorScheme';
import Lang from 'src/Core/UI/Lang';
import Navigation from 'src/Core/UI/Navigation';
import Logger from 'src/Core/Util/Logger';
import { ManagerUser } from 'src/Manager/User';
import Desktop from 'src/UI/Desktop';
import Screen from 'src/UI/Screen';

export default function Page({ children }) {
  return (
    <Node>
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
  );
}
