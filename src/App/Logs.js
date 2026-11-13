import { useMemo } from 'react';
import { VscDebugAltSmall } from 'react-icons/vsc';
import Resources from 'src/Core/UI/Resources';
import Logger from 'src/Core/Util/Logger';
import Screen from 'src/UI/Screen';
import Group from 'src/UI/Widgets/Group';
import styles from './Logs.module.scss';

const resources = {
  TITLE: {
    eng: 'Logs',
    heb: 'יומן',
  },
};

export default function Logs() {
  const lookup = Resources.useLookup();
  const logger = Logger.State.useState();
  const icon = useMemo(() => <VscDebugAltSmall />, []);

  const elements = useMemo(() => {
    const elements = [];
    elements.push(
      ...(logger.items?.map((item) => {
        const { id, type, message } = item;
        return (
          <div className={styles.item} key={id}>
            <div className={styles.type}>{type}</div>
            {message}
          </div>
        );
      }) || []),
    );
    return elements;
  }, [logger.items]);

  return (
    <Resources resources={resources} lookup={lookup}>
      <Screen.Rect left={200} top={100} width={400} height={600} />
      <Screen.State
        icon={icon}
        id="logs"
        label={lookup?.TITLE}
        assetColor="darkorange"
      />
      <Screen>
        <Group vertical>{elements}</Group>
      </Screen>
    </Resources>
  );
}
