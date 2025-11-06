import { useEffect } from "react";
import { createState } from "../Base/State";

function Lang({ id, direction, children }) {
    const lang = Lang.State.useState();

    useEffect(() => {
        const language = localStorage.getItem("language");
        if (language) {
            lang(state => {
                state.id = language;
                state.direction = Lang.getDirection(language);
                state.ready = true;
            });
        } else {
            lang(state => {
                state.ready = true;
            });
        }
    }, [lang]);

    useEffect(() => {
        if (!lang?.id) {
            return;
        }
        localStorage.setItem("language", lang?.id);
    }, [lang, lang?.id]);

    useEffect(() => {
        document.documentElement.setAttribute("dir", lang.direction);
    }, [lang.direction]);

    return <Lang.State id={id} direction={direction}>
        {!!lang.id && !!lang.direction && children}
    </Lang.State>;
}

Lang.getDirection = (langId) => {
    let direction = "ltr"; // Default to Left-to-Right

    switch (langId) {
        case "heb": // Hebrew
        case "ara": // Arabic
        case "fas": // Persian/Farsi
        case "urd": // Urdu
            direction = "rtl"; // Right-to-Left
            break;
        default:
            direction = "ltr"; // Default for English and other LTR languages
            break;
    }
    return direction;
};

Lang.State = createState("Lang.State");

export default Lang;
