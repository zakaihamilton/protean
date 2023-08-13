export default class ListStorage {
    constructor() {

    }

    /** Check if the storage is supported */
    static isSupported() {

    }

    /**
     * Opens the storage.
     *
     * @return {Promise<void>} A promise that resolves when the storage is opened.
     */
    async open() {

    }

    /**
     * Closes the storage.
     *
     * @return {Promise<void>} A promise that resolves when the storage is closed.
     */
    async close() {

    }

    /**
     * Retrieves the value for the given key.
     *
     * @param {string} key - The key to retrieve the value for.
     * @return {type} The value associated with the given key.
     */
    async get(key) {

    }

    /**
     * Sets the value of a given key.
     *
     * @param {string} key - the key to set the value for
     * @param {type} value - the value to set
     * @return {Promise<type>} A promise that resolves with the previous value assigned to the key
     */
    async set(key, value) {

    }

    /**  
     * Deletes a key from the storage.
     * @param {string} key - the key to delete
     * @return {Promise<void>} A promise that resolves when the key has been deleted
     */
    async delete(key) {

    }

    /**
     * Retrieves a list of the keys.
     *
     * @return {Promise<type>} A promise that resolves with the list of keys
     */
    async keys() {

    }

    /**
     * Removes all keys from the storage.
     * @return {Promise<void>} A promise that resolves when the storage is cleared
     */
    async reset() {

    }
}
