import StorageInterface from "../Interface";

class StorageLocal extends StorageInterface {
    constructor() {
        super();
    }

    async connect() { }

    async disconnect() { }

    isSupported() {
        return 'localStorage' in window;
    }

    isConnected() {
        return 'localStorage' in window;
    }

    async keys(filter) {
        if (!this.client) {
            throw "Client not connected";
        }
        if (!filter) {
            return [];
        }
        let keys = Object.keys(localStorage);
        if (filter) {
            keys = keys.filter(key => key.startsWith(filter));
        }
        return keys;
    }

    async get(key) {
        const item = localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
    }
    async set(key, value) {
        if (!key) {
            throw new Error("Key cannot be null");
        }
        if (typeof value === "undefined") {
            localStorage.removeItem(key);
            return;
        }
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }
}

export default StorageLocal;
