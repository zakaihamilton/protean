import { useClasses } from 'src/Core/Util/Styles';
import Screen from '../Screen';
import Actions from './Title/Actions';
import Label from './Title/Label';
import styles from './Title.module.scss';

function Title() {
  const classes = useClasses(styles);
  const screen = Screen.State.useState();
  const className = classes({
    root: true,
    fullscreen: screen.fullscreen,
  });
  return (
    <div className={className}>
      <Label />
      <div className={styles.separator} />
      <Actions />
    </div>
  );
}

export default Title;
