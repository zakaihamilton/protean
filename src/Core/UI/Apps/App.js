import { withNode } from "src/Core/Base/Node";
import { withState } from "src/Core/Base/State";

function App({ children }) {
    return children;
}

export default withNode(withState(App));
