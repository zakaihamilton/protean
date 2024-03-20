'use server'

import ListStorage from "../List";
import Redis from "ioredis"

let client = null
if (process.env.REDIS_URL) {
    client = new Redis(process.env.REDIS_URL);
}
else {
    throw new Error("REDIS_URL environment variable is not set");
}

export default class ListStorageMemory extends ListStorage {
    constructor() {
        super();
    }

    static isSupported() {
        return true;
    }

    /**
     * Retrieves the value for the given key.
     *
     * @param {string} key - The key to retrieve the value for.
     * @return {type} The value associated with the given key.
     */
    async get(key) {
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
    async set(key, value) {
        if (!key) {
            throw new Error("key cannot be null");
        }
        client.set(key, value);
    }

    /**
     * Checks if the key exists
     */
    async exists(key) {
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
    async delete(key) {
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
    async keys() {
        return await client.keys('*');
    }

    /**
     * Removes all keys from the storage.
     * @return {Promise<void>} A promise that resolves when the storage is cleared
     */
    async reset() {
        await client.flushall();
    }
}
