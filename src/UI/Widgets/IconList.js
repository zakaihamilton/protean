import styles from "./IconList.module.scss";
import Item from "./IconList/Item";
import { useMemo } from "react";
import Container from "src/UI/Util/Container";
import { useClasses } from "src/Core/Util/Styles";
import { withState } from "src/Core/Base/State";
import Node from "src/Core/Base/Node";

function IconList({ list, vertical, flex, wrap }) {
    const classes = useClasses(styles);

    const elements = useMemo(() => {
        return list?.map((item, index) => {
            return <Node key={item?.id || item?.label}>
                <Item index={index} item={item} />
            </Node>;
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

export default withState(IconList);
