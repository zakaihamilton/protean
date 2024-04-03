'use server'

import StorageList from "../List";
import Redis from "ioredis"

export default class StorageListRedis extends StorageList {
    constructor() {
        super();
    }

    static isSupported() {
        return true;
    }

    /**
     * Opens the storage.
     *
     * @return {Promise<void>} A promise that resolves when the storage is opened.
     */
    async open() {
        if (this.client) {
            throw new Error("Storage already opened");
        }
        if (!process.env.REDIS_URL) {
            throw new Error("REDIS_URL environment variable is not set");
        }
        this.client = new Redis(process.env.REDIS_URL);
    }

    /**
     * Closes the storage.
     *
     * @return {Promise<void>} A promise that resolves when the storage is closed.
     */
    async close() {
        if (this.client) {
            await this.client.quit();
            this.client = null;
        }
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
        return this.client.get(key);
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
        this.client.set(key, value);
    }

    /**
     * Checks if the key exists
     */
    async exists(key) {
        if (!key) {
            throw new Error("key cannot be null");
        }
        const result = this.client.exists(key);
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
        this.client.del(key);
    }

    /**
     * Retrieves a list of the keys.
     *
     * @return {Promise<type>} A promise that resolves with the list of keys
     */
    async keys() {
        return await this.client.keys('*');
    }

    /**
     * Removes all keys from the storage.
     * @return {Promise<void>} A promise that resolves when the storage is cleared
     */
    async reset() {
        await this.client.flushall();
    }
}
