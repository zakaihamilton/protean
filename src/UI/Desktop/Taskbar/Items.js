import { withTheme } from "src/UI/Util/Theme"
import Windows from "src/UI/Windows";
import styles from "./Items.module.scss";
import Item from "./Items/Item";
import { useMemo } from "react";

function Items() {
    const windows = Windows.State.useState("list");
    const list = windows.list;

    const items = useMemo(() => {
        return list?.map((item, index) => {
            return <Item key={item?.id || index} item={item} />;
        });
    }, [list]);

    return <div className={styles.root}>
        <div className={styles.items}>
            {items}
        </div>
    </div>
}

export default withTheme(Items);
