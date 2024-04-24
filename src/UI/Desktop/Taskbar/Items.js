import { withTheme } from "src/Core/UI/Theme"
import Windows from "src/UI/Windows";
import styles from "./Items.module.scss";
import Item from "./Items/Item";
import { useMemo } from "react";
import Container from "src/UI/Util/Container";

function Items() {
    const windows = Windows.State.useState();
    const list = windows.list;

    const items = useMemo(() => {
        return list?.map((item, index) => {
            return <Item key={item?.id || index} index={index} item={item} />;
        });
    }, [list]);

    return <div className={styles.root}>
        <Container className={styles.items}>
            {items}
        </Container>
    </div>
}

export default withTheme(Items);
