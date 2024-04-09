import { useClasses } from "src/Core/Util/Styles";
import styles from "./Menu.module.scss";
import { createState } from "src/Core/Base/State";
import { withTheme } from "src/Core/UI/Theme";
import { useCallback, useMemo } from "react";
import Item from "./Menu/Item";

function Menu() {
    const state = Menu.State.useState();
    const classes = useClasses(styles);
    const popupClassName = classes({
        popup: true,
        visible: state?.selected?.length
    });
    const elementsClassName = classes({
        elements: true,
        visible: state.visible,
        parent: state.parent
    });
    const elements = useMemo(() => {
        return state.items?.map((item, index) => {
            return <Item key={item.id || index} {...item} />;
        });
    }, [state.items]);
    const onPopupClick = useCallback(() => {
        state.selected = [];
    }, [state]);
    return <div className={styles.root}>
        <div className={popupClassName} onClick={onPopupClick} />
        <div className={elementsClassName}>
            {elements}
        </div>
    </div>;
}

Menu.State = createState("Menu.State");

export default withTheme(Menu);
