'use server'

import { MongoClient } from "mongodb";

let client = null;
let db = null;
let collection = null;

/**
 * Checks if the functionality is supported.
 *
 * @return {boolean} Returns true if the functionality is supported, false otherwise.
*/
export async function isSupported() {
    return true;
}

/**
 * Opens the storage.
 *
 * @return {Promise<void>} A promise that resolves when the storage is opened.
 */
export async function open() {
    if (client) {
        throw new Error("Storage already opened");
    }
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL environment variable is not set");
    }
    if (!process.env.MONGO_DB) {
        throw new Error("MONGO_DB environment variable is not set");
    }
    if (!process.env.MONGO_COLLECTION) {
        throw new Error("MONGO_COLLECTION environment variable is not set");
    }
    client = await MongoClient.connect(process.env.MONGO_URL);
    db = client.db(process.env.MONGO_DB);
    collection = db.collection(process.env.MONGO_COLLECTION);
}

/**
 * Closes the storage.
 *
 * @return {Promise<void>} A promise that resolves when the storage is closed.
 */
export async function close() {
    if (!client) {
        return;
    }
    await client.close();
    client = null;
}

/**
 * Retrieves the value for the given key.
 *
 * @param {string} key - The key to retrieve the value for.
 * @return {type} The value associated with the given key.
 */
export async function get(key) {
    if (!key) {
        throw new Error("key cannot be null");
    }
    if (!collection) {
        return;
    }
    const record = await collection.findOne({ id: key });
    if (record) {
        return record.value;
    }
}

/**
 * Sets the value of a given key.
 *
 * @param {string} key - the key to set the value for
 * @param {type} value - the value to set
 * @return {Promise<void>} A promise that resolves when the value has been stored
 */
export async function set(key, value) {
    if (!key) {
        throw new Error("key cannot be null");
    }
    if (!collection) {
        return;
    }
    const record = { id: key, value: value };
    await collection.replaceOne({ id: key }, record, {
        upsert: true
    });
}

/**
 * Checks if the key exists
 */
export async function exists(key) {
    if (!key) {
        throw new Error("key cannot be null");
    }
    if (!collection) {
        return false;
    }
    const record = await collection.findOne({ id: key });
    return !!record;
}

/**  
 * Deletes a key from the storage.
 * @param {string} key - the key to delete
 * @return {Promise<void>} A promise that resolves when the key has been deleted
 */
export async function deleteKey(key) {
    if (!key) {
        throw new Error("key cannot be null");
    }
    if (!collection) {
        return;
    }
    await collection.deleteOne({ id: key });
}

/**
 * Retrieves a list of the keys.
 *
 * @return {Promise<type>} A promise that resolves with the list of keys
 */
export async function keys() {
    if (!collection) {
        return [];
    }
    let cursor = collection.find({}, { id: 1 });
    const results = await cursor.map(item => item.id).toArray();
    return results;
}

/**
 * Removes all keys from the storage.
 * @return {Promise<void>} A promise that resolves when the storage is cleared
 */
export async function reset() {
    if (!collection) {
        return;
    }
    await collection.drop();
}
