'use server';

import StorageS3 from "./Service/S3";
import StorageMongo from "./Service/Mongo";

const interfaces = {
    s3: StorageS3,
    mongo: StorageMongo
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
    console.log(process.env["STORAGE_" + storageId])
    const storageEnv = process.env["STORAGE_" + storageId];
    if (!storageEnv) {
        throw new Error(`Storage ${storageId} not found`);
    }
    if (storageEnv.use === "server") {
        throw new Error(`Storage ${storageId} not accessible from client`);
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

export async function storageServerGet(storageId, key) {
    const instance = await getInstance(storageId);
    return instance.get(key);
}

export async function storageServerSet(storageId, key, value) {
    const instance = await getInstance(storageId);
    return instance.set(key, value);
}

export async function storageServerKeys(storageId, filter) {
    const instance = await getInstance(storageId);
    return instance.keys(filter);
}
