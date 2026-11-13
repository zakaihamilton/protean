import React, { useCallback, useMemo } from 'react';
import { createState } from 'src/Core/Base/State';
import { useClasses } from 'src/Core/Util/Styles';
import Item from './Menu/Item';
import styles from './Menu.module.scss';

function Menu() {
  const menu = Menu.State.useState();
  const classes = useClasses(styles);
  const popupClassName = classes({
    popup: true,
    visible: menu?.selected?.length,
  });
  const elementsClassName = classes({
    elements: true,
    visible: menu.visible,
    parent: menu.parent,
  });
  const elements = useMemo(() => {
    if (!Array.isArray(menu.items)) {
      return menu.items;
    }
    return menu.items?.map((item, index) => {
      if (React.isValidElement(item)) {
        return item;
      }
      return <Item key={item.id || index} {...item} />;
    });
  }, [menu.items]);
  const onPopupClick = useCallback(() => {
    menu((state) => {
      state.selected = [];
    });
  }, [menu]);
  const onPopupKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onPopupClick();
      }
    },
    [onPopupClick],
  );
  return (
    <div className={styles.root}>
      {/* biome-ignore lint/a11y/useSemanticElements: div is required for layout */}
      <div
        className={popupClassName}
        onClick={onPopupClick}
        onKeyDown={onPopupKeyDown}
        role="button"
        tabIndex={0}
      />
      <div className={elementsClassName}>{elements}</div>
    </div>
  );
}

Menu.State = createState('Menu.State');
Menu.Item = Item;

export default Menu;
