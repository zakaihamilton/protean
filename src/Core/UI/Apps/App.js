import { createState } from "src/Core/Base/State";

function App({ children }) {
    return children;
}

App.State = createState("App.State");

export default App;
