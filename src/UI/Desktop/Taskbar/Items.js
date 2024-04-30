import { withTheme } from "src/Core/UI/Theme"
import Windows from "src/UI/Windows";
import styles from "./Items.module.scss";
import Item from "./Items/Item";
import { useMemo } from "react";
import Container from "src/UI/Util/Container";
import { useClasses } from "src/Core/Util/Styles";

function Items({ vertical = false, list }) {
    const classes = useClasses(styles);

    const items = useMemo(() => {
        return list?.map((item, index) => {
            return <Item key={item?.id || index} index={index} item={item} vertical={vertical} />;
        });
    }, [list, vertical]);

    const rootClassName = classes({ root: true, vertical });
    const itemsClassName = classes({ items: true, vertical });

    return <div className={rootClassName}>
        <Container className={itemsClassName}>
            {items}
        </Container>
    </div>
}

export default withTheme(Items);
