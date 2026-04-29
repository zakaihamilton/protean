import { useElement } from 'src/Core/UI/Element';
import { createRegion } from 'src/Core/UI/Region';
import Screen from '../Screen';
import styles from './Content.module.scss';

function Content({ children }) {
  const [target, element] = useElement();
  const rect = Screen.Rect.useState();

  return (
    <>
      <Content.Region target={target} counter={rect.__counter} />
      <div ref={element} className={styles.root}>
        {children}
      </div>
    </>
  );
}

export default Content;

Content.Region = createRegion('Content.Region');
