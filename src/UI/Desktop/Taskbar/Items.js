import { withTheme } from "src/Core/UI/Theme"
import styles from "./Items.module.scss";
import Item from "./Items/Item";
import { useMemo } from "react";
import Container from "src/UI/Util/Container";
import { useClasses } from "src/Core/Util/Styles";

function Items({ list, vertical }) {
    const classes = useClasses(styles);

    const elements = useMemo(() => {
        return list?.map((item, index) => {
            return <Item key={item?.id || item?.label} index={index} item={item} vertical={vertical} />;
        });
    }, [list, vertical]);

    const rootClassName = classes({ root: true, vertical });
    const itemsClassName = classes({ items: true, vertical });

    return <div className={rootClassName}>
        <Container className={itemsClassName}>
            {elements}
        </Container>
    </div>
}

export default withTheme(Items);
