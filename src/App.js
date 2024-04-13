import Node from "./Core/Base/Node";

import ListEditor from "./App/ListEditor";
import Calculator from "./App/Calculator";

export default function App() {
    return <>
        <Node>
            <ListEditor />
        </Node>
        <Node>
            <Calculator />
        </Node>
    </>;
}
