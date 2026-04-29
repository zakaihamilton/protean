import { useMemo } from 'react';
import Node from 'src/Core/Base/Node';
import { createState } from 'src/Core/Base/State';
import { useClasses } from 'src/Core/Util/Styles';
import Container from 'src/UI/Util/Container';
import Item from './IconList/Item';
import styles from './IconList.module.scss';

function IconList() {
  const { list, vertical, flex, wrap } = IconList.State.useState();
  const classes = useClasses(styles);

  const elements = useMemo(() => {
    return list?.map((item, index) => {
      return (
        <Node key={item?.id || item?.label || index}>
          <Item index={index} item={item} />
        </Node>
      );
    });
  }, [list]);

  const rootClassName = classes({ root: true, vertical, flex });
  const itemsClassName = classes({ items: true, vertical, wrap });

  return (
    <div className={rootClassName}>
      <Container className={itemsClassName}>{elements}</Container>
    </div>
  );
}

IconList.State = createState('IconList.State');

export default IconList;
