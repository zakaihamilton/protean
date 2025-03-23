import styles from "./Search.module.scss";
import Container from "src/UI/Util/Container";
import { useClasses } from "src/Core/Util/Styles";
import { useCallback } from "react";

function Search({ flex, placeholder = "Search...", dynamic }) {
    const classes = useClasses(styles);

    const value = dynamic?.() ?? "";

    const rootClassName = classes({ root: true, flex });
    const containerClassName = classes({ container: true });
    const inputClassName = classes({ input: true });

    const onChange = useCallback(e => {
        const value = e.target.value;
        dynamic?.(value);
    }, [dynamic]);

    return <div className={rootClassName}>
        <Container className={containerClassName}>
            <input type="search" className={inputClassName} placeholder={placeholder} value={value} onChange={onChange} />
        </Container>
    </div>
}

export default Search;
