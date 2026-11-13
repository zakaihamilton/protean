import { useEffect, useMemo } from 'react';
import { createState } from 'src/Core/Base/State';
import { create } from 'src/Core/Base/Util';
import { useAnimate } from 'src/Core/UI/Animate';
import App from 'src/Core/UI/Apps/App';
import { useElement } from 'src/Core/UI/Element';
import { createRegion } from 'src/Core/UI/Region';
import { useClasses } from 'src/Core/Util/Styles';
import Drag from '../Core/UI/Drag';
import Content from './Screen/Content';
import { useDock } from './Screen/Dock';
import Fullscreen from './Screen/Fullscreen';
import ScreenManager, { useScreenItem } from './Screen/Manager';
import Menu from './Screen/Menu';
import Resize from './Screen/Resize';
import Title from './Screen/Title';
import styles from './Screen.module.scss';

function Screen({ children }) {
  const classes = useClasses(styles);
  const rect = Screen.Rect.useState();
  const dockStyle = useDock();
  const screen = Screen.State.useState();
  const app = App.State.useState();
  const min = useMemo(
    () => ({
      width: screen?.min?.width || 200,
      height: screen?.min?.height || 200,
    }),
    [screen?.min],
  );
  const animate = useAnimate(screen?.__counter, 200);
  const [target, element] = useElement();
  useScreenItem(screen, target);

  const className = classes({
    root: true,
    ...screen,
    [screen.dock]: screen.dock,
    animate,
  });

  const style = useMemo(() => {
    return {
      ...dockStyle,
      zIndex: screen.index,
      '--accent-color': screen.assetColor || 'darkblue',
    };
  }, [dockStyle, screen.index, screen.assetColor]);

  useEffect(() => {
    if (screen) {
      screen((state) => {
        state.appId = app?.id;
      });
    }
  }, [app?.id, screen]);

  return (
    <>
      <Drag rect={rect} min={min} />
      <Screen.Region target={target} counter={rect.__counter} />
      <div ref={element} className={className} style={style}>
        <Title />
        <Menu />
        <Content>{children}</Content>
        <Fullscreen />
        <Resize />
      </div>
    </>
  );
}

create(Screen, 'Screen', {
  Rect: createState,
  Region: createRegion,
  Actions: createState,
  State: createState,
  List: createState,
});

Screen.Manager = ScreenManager;

export default Screen;
