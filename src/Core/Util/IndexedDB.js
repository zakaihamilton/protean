// Function to create or open an IndexedDB database.
export async function openDatabase(dbName, version, upgradeCallback) {
    console.log("opening database", dbName, "version", version);
    const request = indexedDB.open(dbName, version);

    return new Promise((resolve, reject) => {
        request.onupgradeneeded = (event) => {
            console.log("upgrade needed on database", dbName);
            const db = event.target.result;
            upgradeCallback(db);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            console.log("database opened successfully", dbName);
            resolve(db);
        };

        request.onerror = (event) => {
            console.error("error opening database", dbName, event.target.error);
            reject(event.target.error);
        };

        request.onblocked = (event) => {
            console.warn("Database open blocked, another connection is open with a higher version.");
            reject(new Error("Database open blocked, another connection is open with a higher version."));
        };
    });
}

// Function to close open IndexedDB database.
export function closeDatabase(db) {
    console.log("closing database");
    db.close();
}

// Function to delete indexedb database.
export async function deleteDatabase(dbName) {
    console.log("deleting database", dbName);
    const request = indexedDB.deleteDatabase(dbName);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            console.log("database deleted successfully", dbName);
            resolve();
        };

        request.onerror = (event) => {
            console.error("error deleting database", dbName, event.target.error);
            reject(event.target.error);
        };

        request.onblocked = (event) => {
            console.warn("Database deletion blocked, another connection is open.", dbName);
            reject(new Error("Database deletion blocked, another connection is open."));
        };
    });
}

//Function to create an object store within the database.
export function createObjectStore(db, objectStoreName, options) {
    if (db.objectStoreNames.contains(objectStoreName)) {
        // Object store already exists, no need to create it again.
        return db.transaction(objectStoreName).objectStore(objectStoreName);
    }

    console.log("Creating object store:", objectStoreName);
    const objectStore = db.createObjectStore(objectStoreName, options);

    return objectStore;
}

//Function to create a record in an object store.
export async function createRecord(store, record, key) {
    return new Promise((resolve, reject) => {
        const request = store.add(record, key);
        request.onsuccess = (event) => {
            const recordId = event.target.result;
            console.log("record created successfully", recordId, key);
            resolve(recordId);
        };

        request.onerror = (event) => {
            console.error("error creating record", key, event.target.error);
            reject(event.target.error);
        };
    });
}

//Function to update a record in an object store.
export async function updateRecord(store, record, key) {
    return new Promise((resolve, reject) => {
        const request = store.put(record, key);
        request.onsuccess = (event) => {
            const recordId = event.target.result;
            console.log("record created successfully", key, recordId);
            resolve(recordId);
        };

        request.onerror = (event) => {
            console.error("error updating record", key, event.target.error);
            reject(event.target.error);
        };
    });
}

//Function to get record in an object store.
export async function getRecord(store, recordId) {
    if (!recordId) {
        throw "recordId is required";
    }
    return new Promise((resolve, reject) => {
        const request = store.get(recordId);
        request.onsuccess = (event) => {
            const record = event.target.result;
            console.log("record retrieved successfully", recordId, "record", record);
            resolve(record);
        };
        request.onerror = (event) => {
            console.error("error getting record", recordId, event.target.error);
            reject(event.target.error);
        };
    });
}

//Function to delete record in an object store.
export async function deleteRecord(store, recordId) {
    if (!recordId) {
        throw "recordId is required";
    }
    return new Promise((resolve, reject) => {
        const request = store.delete(recordId);
        request.onsuccess = (event) => {
            console.log("record deleted successfully", recordId);
            resolve();
        };
        request.onerror = (event) => {
            console.error("error deleting record", recordId, event.target.error);
            reject(event.target.error);
        };
    });
}

//Function to iterate over records in an object store
export async function iterateRecords(store, callback) {
    return new Promise((resolve, reject) => {
        let listing = [];
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = async (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (callback) {
                    const result = callback(cursor.value, cursor.key);
                    if (result) {
                        listing.push(result);
                    }
                }
                else {
                    listing.push(cursor.key);
                }
                cursor.continue();
            }
            else {
                resolve(listing);
            }
        };

        cursorRequest.onerror = (event) => {
            console.error("error iterating over records", event.target.error);
            reject(event.target.error);
        };

    });
}