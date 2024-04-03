'use server'

import StorageList from "../List";
import { MongoClient } from "mongodb";

export default class StorageListMongo extends StorageList {
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
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is not set");
        }
        if (!process.env.MONGO_DB) {
            throw new Error("MONGO_DB environment variable is not set");
        }
        if (!process.env.MONGO_COLLECTION) {
            throw new Error("MONGO_COLLECTION environment variable is not set");
        }
        this.client = await MongoClient.connect(process.env.MONGO_URL);
        this.db = this.client.db(process.env.MONGO_DB);
        this.collection = this.db.collection(process.env.MONGO_COLLECTION);
    }

    /**
     * Closes the storage.
     *
     * @return {Promise<void>} A promise that resolves when the storage is closed.
     */
    async close() {
        if (this.client) {
            await this.client.close();
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
        const record = await this.collection.findOne({ id: key });
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
    async set(key, value) {
        if (!key) {
            throw new Error("key cannot be null");
        }
        const record = { id: key, value: value };
        await this.collection.replaceOne({ id: key }, record, {
            upsert: true
        });
    }

    /**
     * Checks if the key exists
     */
    async exists(key) {
        if (!key) {
            throw new Error("key cannot be null");
        }
        const record = await this.collection.findOne({ id: key });
        return !!record;
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
        await this.collection.deleteOne({ id: key });
    }

    /**
     * Retrieves a list of the keys.
     *
     * @return {Promise<type>} A promise that resolves with the list of keys
     */
    async keys() {
        let cursor = this.collection.find({}, { id: 1 });
        const results = await cursor.map(item => item.id).toArray();
        return results;
    }

    /**
     * Removes all keys from the storage.
     * @return {Promise<void>} A promise that resolves when the storage is cleared
     */
    async reset() {
        await this.collection.drop();
    }
}
