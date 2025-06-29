'use server';

import StorageLocal from "./Service/Local";

const interfaces = {
    local: StorageLocal
};

const env = {
    LOCAL: {
        api: "local"
    }
};

const instances = {};

async function getInstance(storageId) {
    if (!storageId) {
        return;
    }
    storageId = storageId.trim().toUpperCase();
    if (instances[storageId]) {
        return instances[storageId];
    }
    let storageEnv = env[storageId];
    console.log("storage:", storageId, storageEnv);
    if (!storageEnv) {
        throw new Error(`Storage ${storageId} not found`);
    }
    const Interface = interfaces[storageEnv.api];
    if (!Interface) {
        throw new Error(`Storage ${storageId} api ${storageEnv.api} not found`);
    }
    const instance = new Interface();
    await instance.connect(storageEnv);
    instances[storageId] = instance;
    return instance;
}

export async function storageClientGet(storageId, key) {
    const instance = await getInstance(storageId);
    return instance.get(key);
}

export async function storageClientSet(storageId, key, value) {
    const instance = await getInstance(storageId);
    return instance.set(key, value);
}

export async function storageClientKeys(storageId, filter) {
    const instance = await getInstance(storageId);
    return instance.keys(filter);
}
