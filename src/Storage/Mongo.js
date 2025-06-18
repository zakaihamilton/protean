import StorageInterface from "./Interface";
import { MongoClient } from "mongodb";

class StorageMongo extends StorageInterface {
    constructor() {
        super();
    }

    async connect(storage) {
        this.storage = storage;
        this.client = await MongoClient.connect(storage.connect);
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
        }
    }

    isConnected() {
        return !!this.client;
    }

    async keys(filter) {
        if (!this.client) {
            throw "Client not connected";
        }
        if (!filter) {
            return [];
        }
        const url = (this.storage.path || "") + filter;
        const [dbName, collectionName] = url.split('/');
        const database = this.client.db(dbName);
        const collection = database.collection(collectionName);
        let cursor = collection.find({}, { id: 1 });
        const results = await cursor.map(item => item.id).toArray();
        return results;
    }

    async get(key) {
        if (!this.client) {
            throw "Client not connected";
        }

        const url = this.storage.path + key;
        const [dbName, collectionName, recordId] = url.split('/');
        const database = this.client.db(dbName);
        const collection = database.collection(collectionName);
        const record = await collection.findOne({ id: recordId });
        return record;
    }
    async set(key, value) {
        if (!this.client) {
            throw "Client not connected";
        }

        const url = this.storage.path + key;
        const [dbName, collectionName, recordId] = url.split('/');
        const database = this.client.db(dbName);
        const collection = database.collection(collectionName);
        if (typeof value === 'undefined') {
            await collection.deleteOne({ id: recordId });
        }
        else {
            const data = { id: recordId, ...value };
            await collection.replaceOne({ id: recordId }, data, {
                upsert: true
            });
        }
    }
}

export default StorageMongo;
