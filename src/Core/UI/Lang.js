import { useEffect } from "react";
import { createState } from "../Base/State";
import { createConsole } from "../Util/Console";
import Fetch from "../Data/Fetch";

const console = createConsole("Lang");

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
                lang.packs = [...lang?.packs || [], { id: itemId, text }];
            }
            catch (err) {
                console.error(err);
            }
        }
        getPack();
    }, [fetch, itemId, lang, langId, pack, packId, packs]);

    return pack?.text;
};

Lang.State = createState("Lang.State");

export default Lang;
