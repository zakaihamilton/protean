import Node, { nodeGetId } from "./Node";
import { createState } from "src/Core/Base/State";

export function createAlias(...args) {
    function Alias() {
        const node = Node.useNode();
        const nodeId = nodeGetId(node);
        return <Alias.State nodeId={nodeId} />;
    }
    Alias.State = createState(...args);
    Alias.useAlias = (...args) => {
        const state = Alias.State.useState(...args);
        return state?.nodeId;
    };
    return Alias;
}
