import { useCallback } from 'react';
import Resources from 'src/Core/UI/Resources';
import { useClasses } from 'src/Core/Util/Styles';
import Screen from 'src/UI/Screen';
import Container from 'src/UI/Util/Container';
import Tooltip from 'src/UI/Widgets/Tooltip';
import styles from './Restore.module.scss';

const resources = {
  RESTORE: {
    eng: 'Restore',
    heb: 'שחזר',
  },
};

function Restore() {
  const lookup = Resources.useLookup();
  const classes = useClasses(styles);
  const actions = Screen.Actions.useState();
  const screen = Screen.State.useState();
  const className = classes({
    root: true,
    focus: screen.focus,
    visible:
      screen.maximize &&
      !screen.center &&
      !screen.dock &&
      !screen.fixed &&
      (actions.restore ?? true),
  });
  const onClick = useCallback(() => {
    screen((state) => {
      state.maximize = false;
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

  return (
    <Resources resources={resources} lookup={lookup}>
      <Container>
        {/* biome-ignore lint/a11y/useSemanticElements: div is required for layout */}
        <div
          onClick={onClick}
          onKeyDown={onKeyDown}
          className={className}
          role="button"
          tabIndex={0}
        />
        <Tooltip title={lookup?.RESTORE} enabled={screen.focus} />
      </Container>
    </Resources>
  );
}

export default Restore;
