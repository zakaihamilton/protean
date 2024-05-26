import { withTheme } from "src/Core/UI/Theme"
import styles from "./IconList.module.scss";
import Item from "./IconList/Item";
import { useMemo } from "react";
import Container from "src/UI/Util/Container";
import { useClasses } from "src/Core/Util/Styles";
import { withState } from "src/Core/Base/State";

function IconList({ list, vertical, flex, wrap }) {
    const classes = useClasses(styles);

    const elements = useMemo(() => {
        return list?.map((item, index) => {
            return <Item key={item?.id || item?.label} index={index} item={item} />;
        });
    }, [list]);

    const rootClassName = classes({ root: true, vertical, flex });
    const itemsClassName = classes({ items: true, vertical, wrap });

    return <div className={rootClassName}>
        <Container className={itemsClassName}>
            {elements}
        </Container>
    </div>
}

export default withTheme(withState(IconList));
