import { useCallback } from 'react';
import Resources from 'src/Core/UI/Resources';
import { useClasses } from 'src/Core/Util/Styles';
import Screen from 'src/UI/Screen';
import Container from 'src/UI/Util/Container';
import Tooltip from 'src/UI/Widgets/Tooltip';
import styles from './Close.module.scss';

const resources = {
  CLOSE: {
    eng: 'Close',
    heb: 'סגור',
  },
};

function Close() {
  const lookup = Resources.useLookup();
  const classes = useClasses(styles);
  const actions = Screen.Actions.useState();
  const screen = Screen.State.useState();
  const className = classes({
    root: true,
    focus: screen.focus,
    visible: !screen.permanent && (actions.close ?? true),
  });
  const onClick = useCallback(() => {
    screen((state) => {
      state.close = true;
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
        >
          <div className={styles.close} />
        </div>
        <Tooltip title={lookup?.CLOSE} enabled={screen.focus} />
      </Container>
    </Resources>
  );
}

export default Close;
