import { useCallback } from 'react';
import { useClasses } from 'src/Core/Util/Styles';
import Segment from '../Segment';
import styles from './Collapse.module.scss';

export default function Collapse() {
  const classes = useClasses(styles);
  const segment = Segment.State.useState();
  const onClick = useCallback(() => {
    segment((state) => {
      state.collapse = !state.collapse;
    });
  }, [segment]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    },
    [onClick],
  );

  const className = classes({ root: true, active: segment.collapse });
  return (
    // biome-ignore lint/a11y/useSemanticElements: div is required for layout
    <div
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
    >
      -
    </div>
  );
}
