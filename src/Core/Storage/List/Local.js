/**
 * Checks if the functionality is supported.
 *
 * @return {boolean} Returns true if the functionality is supported, false otherwise.
*/
export async function isSupported() {
    try {
        return 'localStorage' in window;
    } catch (e) {
        return false;
    }
}

/**
 * Opens the storage.
 *
 * @return {Promise<void>} A promise that resolves when the storage is opened.
 */
export async function open() {

}

/**
 * Closes the storage.
 *
 * @return {Promise<void>} A promise that resolves when the storage is closed.
 */
export async function close() {

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
    return localStorage.getItem(key);
}

/**
 * Sets the value of a given key in the local storage.
 *
 * @param {string} key - The key to set the value for.
 * @param {any} value - The value to set.
 * @return {Promise<void>} A promise that resolves when the value has been stored.
 */
export async function set(key, value) {
    if (!key) {
        throw new Error("Key cannot be null");
    }
    if (typeof value === "object") {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
}

/**
 * Checks if the key exists
 */
export async function exists(key) {
    if (!key) {
        throw new Error("key cannot be null");
    }
    const result = Object.keys(localStorage).includes(key);
    return result;
}

/**  
  * Deletes a key from the storage.
  * @param {string} key - the key to delete
  * @return {Promise<void>} A promise that resolves when the key has been deleted
  */
export async function deleteKey(key) {
    if (!key) {
        throw new Error("Key cannot be null");
    }
    localStorage.removeItem(key);
}

/**
 * Retrieves a list of the keys.
 *
 * @return {Promise<type>} A promise that resolves with the list of keys
 */
export async function keys() {
    return Object.keys(localStorage);
}

/**
 * Removes all keys from the storage.
 * @return {Promise<void>} A promise that resolves when the storage is cleared
 */
export async function reset() {
    localStorage.clear();
}

