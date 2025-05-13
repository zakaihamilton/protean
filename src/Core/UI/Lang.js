import { useEffect } from "react";
import { createState } from "../Base/State";
import { createConsole } from "../Util/Console";
import Fetch from "../Data/Fetch";

const console = createConsole("Lang");

const createTextProxy = (textObject) => {
    if (!textObject || typeof textObject !== 'object') {
        return textObject;
    }

    return new Proxy(textObject, {
        get: (target, property, receiver) => {
            if (Reflect.has(target, property)) {
                const value = Reflect.get(target, property, receiver);
                return value;
            } else {
                return property;
            }
        }
    });
};

function Lang() {
    const lang = Lang.State.useState();

    useEffect(() => {
        console.log("lang:", lang?.id);
    }, [lang?.id]);
}

Lang.useText = (packId = "common") => {
    const fetch = Fetch.useFetch();
    const lang = Lang.State.useState();
    const packs = lang?.packs;
    const langId = lang?.id || "eng";
    const itemId = `${packId}.${langId}`;
    const pack = packs?.find(item => item?.id === itemId);
    useEffect(() => {
        if (pack) {
            return;
        }
        const getPack = async () => {
            try {
                const text = await fetch(`/locales/${langId}/${packId}.json`);
                const pack = packs?.find(item => item?.id === itemId);
                if (pack) {
                    return;
                }
                lang.packs = [...lang?.packs || [], { id: itemId, text: createTextProxy(text) }];
            }
            catch (err) {
                console.error(err);
            }
        }
        getPack();
    }, [fetch, itemId, lang, langId, pack, packId, packs]);

    useEffect(() => {
        const direction = Lang.setDirection(langId);
        lang.direction = direction;
    }, [lang, langId]);

    return pack?.text || {};
};


Lang.setDirection = (langId) => {
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
    document.documentElement.setAttribute("dir", direction);
    console.log(`Page direction set to ${direction} for language: ${langId}`);
    return direction;
};

Lang.State = createState("Lang.State");

export default Lang;
