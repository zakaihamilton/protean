import { useClasses } from "src/Core/Util/Styles";
import styles from "./Menu.module.scss";
import { createState } from "src/Core/Base/State";
import { withTheme } from "src/Core/UI/Theme";
import { useMemo } from "react";
import Item from "./Menu/Item";

function Menu() {
    const state = Menu.State.useState();
    const classes = useClasses(styles);
    const className = classes({
        root: true,
        visible: state.visible,
        parent: state.parent
    });
    const elements = useMemo(() => {
        return state.items?.map((item, index) => {
            return <Item key={item.id || index} {...item} />;
        });
    }, [state.items]);
    return <div className={className}>
        {elements}
    </div>;
}

Menu.State = createState("Menu.State");

export default withTheme(Menu);
