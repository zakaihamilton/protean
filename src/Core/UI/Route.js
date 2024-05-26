import { useEffect } from "react";
import { withNode } from "../Base/Node";
import { withState } from "../Base/State";

function Route({ children }) {
    const route = Route.State.useState();
    const parentRoute = Node.useNode(undefined, Route.State);

    useEffect(() => {
        if (!parentRoute) {

        }
    }, [parentRoute]);

    return <>
        {children}
    </>;
}

export default withNode(withState(Route));
