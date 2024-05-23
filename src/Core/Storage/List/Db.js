const dbName = "db";
const objectStoreName = "list";
let db = null;

/**
 * Checks if the functionality is supported.
 *
 * @return {boolean} Returns true if the functionality is supported, false otherwise.
*/
export async function isSupported() {
    try {
        if (indexedDB.open) {
            return true;
        }
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Opens the storage.
 *
 * @return {Promise<void>} A promise that resolves when the storage is opened.
 */
export async function open() {
    if (db) {
        throw new Error("Storage already opened");
    }
    const request = indexedDB.open(dbName, 1);

    return new Promise((resolve, reject) => {
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStoreNames = db.objectStoreNames;
            if (!objectStoreNames.contains(objectStoreName)) {
                db.createObjectStore(objectStoreName, { unique: true });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };

        request.onblocked = () => {
            reject(new Error("Database open blocked, another connection is open with a higher version."));
        };
    });
}

/**
 * Closes the storage.
 *
 * @return {Promise<void>} A promise that resolves when the storage is closed.
 */
export async function close() {
    if (db) {
        await db.close();
        db = null;
    }
}

export async function get(key) {
    if (!key) {
        throw new Error("key cannot be null");
    }
    if (!db) {
        throw new Error("StorageLocal not initialized. Call open() before using the storage.");
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, "readonly");
        const store = transaction.objectStore(objectStoreName);
        const request = store.get(key);

        transaction.onerror = (event) => {
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
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
    if (!db) {
        throw new Error("StorageLocal not initialized. Call open() before using the storage.");
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, "readwrite");

        transaction.onerror = (event) => {
            reject(event.target.error);
        };

        const store = transaction.objectStore(objectStoreName);
        const request = store.put(value, key);

        request.onsuccess = (event) => {
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

/**
 * Checks if the key exists
 */
export async function exists(key) {
    if (!key) {
        throw new Error("key cannot be null");
    }
    const result = (await keys()).includes(key);
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
    if (!db) {
        throw new Error("StorageLocal not initialized. Call open() before using the storage.");
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, "readwrite");

        transaction.onerror = (event) => {
            reject(event.target.error);
        }

        const store = transaction.objectStore(objectStoreName);
        const request = store.delete(key);

        request.onsuccess = (event) => {
            resolve();
        }

        request.onerror = (event) => {
            reject(event.target.error);
        }
    })
}

/**
 * Retrieves a list of the keys.
 *
 * @return {Promise<type>} A promise that resolves with the list of keys
 */
export async function keys() {
    if (!db) {
        throw new Error("StorageLocal not initialized. Call open() before using the storage.");
    }
    return new Promise((resolve, reject) => {
        let listing = [];
        const transaction = db.transaction(objectStoreName, "readonly");
        const store = transaction.objectStore(objectStoreName);
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                listing.push(cursor.key);
                cursor.continue();
            } else {
                resolve(listing);
            }
        };

        cursorRequest.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

/**
 * Removes all keys from the storage.
 * @return {Promise<void>} A promise that resolves when the storage is cleared
 */
export async function reset() {
    const wasOpen = db;
    if (wasOpen) {
        await close();
    }
    const request = indexedDB.deleteDatabase(dbName);

    await new Promise((resolve, reject) => {
        request.onsuccess = resolve;
        request.onerror = (event) => reject(event.target.error);
        request.onblocked = () => reject(new Error("Database deletion blocked, another connection is open."));
    });
    if (wasOpen) {
        await open();
    }
}
