import ListStorage from "../List";

export default class ListStorageMemory extends ListStorage {
    constructor() {
        super();
        this.list = {};
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
        return this.list[key];
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
        this.list[key] = value;
    }

    /**
     * Checks if the key exists
     */
    async exists(key) {
        if (!key) {
            throw new Error("key cannot be null");
        }
        const result = Object.keys(this.list).includes(key);
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
        delete this.list[key];
    }

    /**
     * Retrieves a list of the keys.
     *
     * @return {Promise<type>} A promise that resolves with the list of keys
     */
    async keys() {
        return Object.keys(this.list);
    }

    /**
     * Removes all keys from the storage.
     * @return {Promise<void>} A promise that resolves when the storage is cleared
     */
    async reset() {
        this.list = {};
    }
}
