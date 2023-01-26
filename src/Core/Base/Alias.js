import Node from "./Node";

export function createAlias(...args) {
    function Alias() {
        const node = Node.useNode();
        const nodeId = node.get("id");
        return <Alias.State nodeId={nodeId} />;
    }
    Alias.State = createState(...args);
    Alias.useAlias = (...args) => {
        const state = Alias.State.useState(...args);
        return state?.nodeId;
    };
    return Alias;
}
