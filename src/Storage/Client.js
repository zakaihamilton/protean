'use server';

import StorageLocal from "./Service/Local";

const interfaces = {
    local: StorageLocal
};

const instances = {};

async function getInstance(storageId) {
    storageId = storageId.trim().toLowerCase();
    if (!storageId) {
        return;
    }
    if (instances[storageId]) {
        return instances[storageId];
    }
    const Interface = interfaces[storageId];
    if (!Interface) {
        throw new Error(`Storage ${storageId} not found`);
    }
    const instance = new Interface();
    await instance.connect();
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
