import { useEffect, useState } from "react";
import { createState } from "src/Core/Base/State";

export function createRegion(displayName) {
    function Region({ target }) {
        const [region, setRegion] = useState({});
        useEffect(() => {
            if (target) {
                setRegion(target.getBoundingClientRect());
            }
            else {
                setRegion({});
            }
        }, [target]);
        return <Region.State {...region} />;
    }
    Region.State = createState(displayName);

    return Region;
}
