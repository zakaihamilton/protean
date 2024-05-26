import { useClasses } from "src/Core/Util/Styles";
import styles from "./Menu.module.scss";
import { createState } from "src/Core/Base/State";
import { withTheme } from "src/Core/UI/Theme";
import { useCallback, useMemo } from "react";
import Item from "./Menu/Item";

function Menu() {
    const menu = Menu.State.useState();
    const classes = useClasses(styles);
    const popupClassName = classes({
        popup: true,
        visible: menu?.selected?.length
    });
    const elementsClassName = classes({
        elements: true,
        visible: menu.visible,
        parent: menu.parent
    });
    const elements = useMemo(() => {
        return menu.items?.map((item, index) => {
            return <Item key={item.id || index} {...item} />;
        });
    }, [menu.items]);
    const onPopupClick = useCallback(() => {
        menu.selected = [];
    }, [menu]);
    return <div className={styles.root}>
        <div className={popupClassName} onClick={onPopupClick} />
        <div className={elementsClassName}>
            {elements}
        </div>
    </div>;
}

Menu.State = createState("Menu.State");

export default withTheme(Menu);
