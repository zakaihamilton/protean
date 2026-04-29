import { useCallback, useMemo } from 'react';
import Node from 'src/Core/Base/Node';
import { useClasses } from 'src/Core/Util/Styles';
import Menu from '../Menu';
import styles from './Item.module.scss';

export default function Item({ label, id, items, onClick, checked, children }) {
  const menu = Menu.State.useState();
  const classes = useClasses(styles);
  const selected = menu?.selected === id;
  const itemClassName = classes({ item: true, selected });
  const labelClassName = classes({ label: true, selected });
  const checkClassName = classes({
    check: true,
    selected,
    checked,
    visible: typeof checked !== 'undefined',
  });
  const onClickItem = useCallback(() => {
    let close = false;
    if (onClick) {
      close = onClick();
    }
    if (close) {
      let parent = menu;
      for (;;) {
        parent = parent.parent;
        if (!parent) {
          break;
        }
        parent.selected = [];
      }
      return;
    }
    if (selected) {
      menu.selected = null;
    } else {
      menu.selected = id;
    }
  }, [id, menu, onClick, selected]);
  const onKeyDownItem = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClickItem();
      }
    },
    [onClickItem],
  );
  const combinedItems = useMemo(() => {
    return [...(items || []), ...(children || [])];
  }, [items, children]);
  return (
    <div className={styles.root}>
      <div
        className={itemClassName}
        onClick={onClickItem}
        onKeyDown={onKeyDownItem}
        role="menuitem"
        tabIndex={0}
      >
        <div className={checkClassName} />
        <div className={labelClassName}>{label}</div>
      </div>
      {!!selected && !!combinedItems?.length && (
        <Node id={id}>
          <Menu.State
            nodeId={id}
            visible={selected}
            items={combinedItems}
            parent={menu}
          />
          <Menu />
        </Node>
      )}
    </div>
  );
}
