'use server'

import Redis from "ioredis"

let client = null;

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
    if (!process.env.REDIS_URL) {
        throw new Error("REDIS_URL environment variable is not set");
    }
    client = new Redis(process.env.REDIS_URL);
}

/**
 * Closes the storage.
 *
 * @return {Promise<void>} A promise that resolves when the storage is closed.
 */
export async function close() {
    if (client) {
        await client.quit();
        client = null;
    }
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
    return client.get(key);
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
    client.set(key, value);
}

/**
 * Checks if the key exists
 */
export async function exists(key) {
    if (!key) {
        throw new Error("key cannot be null");
    }
    const result = client.exists(key);
    return result;
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
    client.del(key);
}

/**
 * Retrieves a list of the keys.
 *
 * @return {Promise<type>} A promise that resolves with the list of keys
 */
export async function keys() {
    return await client.keys('*');
}

/**
 * Removes all keys from the storage.
 * @return {Promise<void>} A promise that resolves when the storage is cleared
 */
export async function reset() {
    await client.flushall();
}
