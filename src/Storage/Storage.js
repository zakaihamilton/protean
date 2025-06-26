import { storageServerGet, storageServerSet, storageServerKeys } from "./Server";
import { storageClientGet, storageClientSet, storageClientKeys } from "./Client";

const serverStorage = { get: storageServerGet, set: storageServerSet, keys: storageServerKeys };
const clientStorage = { get: storageClientGet, set: storageClientSet, keys: storageClientKeys };

const storageMap = {
    mongo: serverStorage,
    s3: serverStorage,
    local: clientStorage
};

const storageList = Object.fromEntries(
    Object.entries(storageMap).map(([name, fns]) => [
        name,
        {
            get: fns.get.bind(name),
            set: fns.set.bind(name),
            keys: fns.keys.bind(name)
        }
    ])
);

export default storageList;