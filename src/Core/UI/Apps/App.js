import { withState } from "src/Core/Base/State";

function App({ children }) {
    return children;
}

export default withState(App);
