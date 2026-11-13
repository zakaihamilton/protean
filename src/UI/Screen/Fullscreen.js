import { useCallback } from 'react';
import { useClasses } from 'src/Core/Util/Styles';
import Screen from '../Screen';
import Container from '../Util/Container';
import Tooltip from '../Widgets/Tooltip';
import styles from './Fullscreen.module.scss';

export default function Fullscreen() {
  const classes = useClasses(styles);
  const screen = Screen.State.useState();

  const onClick = useCallback(() => {
    screen((state) => {
      state.fullscreen = !state.fullscreen;
    });
  }, [screen]);
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    },
    [onClick],
  );

  const className = classes({
    root: true,
    hidden: screen.fixed || !screen.maximize,
    focus: screen.focus,
  });
  const buttonClassName = classes({ button: true });
  return (
    <Container className={className}>
      {/* biome-ignore lint/a11y/useSemanticElements: div is required for layout */}
      <div
        className={buttonClassName}
        onClick={onClick}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
      />
      <Tooltip title="Fullscreen" enabled={screen.focus} />
    </Container>
  );
}
