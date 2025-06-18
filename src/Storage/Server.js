'use server';

import StorageS3 from "./S3";
import StorageMongo from "./Mongo";

const interfaces = {
    s3: StorageS3,
    mongo: StorageMongo
};

const instances = {};

function getInstance(storageId) {
    if (instances[storageId]) {
        return instances[storageId];
    }
    console.log(process.env["STORAGE_" + storageId])
    const storage = process.env["STORAGE_" + storageId];
    if (!storage) {
        throw new Error(`Storage ${storageId} not found`);
    }
    const Interface = interfaces[storage.api];
    if (!Interface) {
        throw new Error(`Storage ${storageId} api ${storage.api} not found`);
    }
    const instance = new Interface();
    instance.connect(storage);
    instances[storageId] = instance;
    return instance;
}

export function storageGet(storageId, key) {
    const instance = getInstance(storageId);
    return instance.get(key);
}

export function storageSet(storageId, key, value) {
    const instance = getInstance(storageId);
    return instance.set(key, value);
}

export function storageKeys(storageId, filter) {
    const instance = getInstance(storageId);
    return instance.keys(filter);
}
