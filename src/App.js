import Node from "./Core/Base/Node";

import ListEditor from "./App/ListEditor";
import Calculator from "./App/Calculator";
import Controls from "./App/Controls";
import TaskManager from "./App/TaskManager";

export default function App() {
    return <>
        <Node>
            <ListEditor />
        </Node>
        <Node>
            <Calculator />
        </Node>
        <Node>
            <Controls />
        </Node>
        <Node>
            <TaskManager />
        </Node>
    </>;
}
