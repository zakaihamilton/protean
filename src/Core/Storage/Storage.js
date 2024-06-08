import { createState } from "../Base/State";

export default function Storage({ State }) {
    const state = State.useState();

    return state;
}

Storage.State = createState("Storage.State");
