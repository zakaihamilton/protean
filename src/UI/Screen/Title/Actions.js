import Close from './Actions/Close';
import Maximize from './Actions/Maximize';
import Minimize from './Actions/Minimize';
import Restore from './Actions/Restore';
import styles from './Actions.module.scss';

export default function Actions() {
  return (
    <div className={styles.root}>
      <Close />
      <Minimize />
      <Restore />
      <Maximize />
    </div>
  );
}
