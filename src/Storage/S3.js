import StorageInterface from "./Interface";
import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    NoSuchKey,
} from '@aws-sdk/client-s3';

class StorageS3 extends StorageInterface {
    constructor() {
        super();
    }

    async connect(storage) {
        this.storage = storage;
        this.client = new S3Client(storage.connect);
    }

    async disconnect() {
        if (this.client) {
            this.client.destroy();
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
        const command = new ListObjectsV2Command({
            Bucket: this.storage.bucket,
            Prefix: (this.storage.path || "") + filter,
        });

        try {
            const { Contents } = await this.client.send(command);
            if (!Contents) {
                return [];
            }
            return Contents.map(item => item.Key);
        } catch (error) {
            if (error.name === 'NoSuchBucket') {
                return [];
            }
            throw error;
        }
    }

    async get(key) {
        if (!this.client) {
            throw "Client not connected";
        }

        const command = new GetObjectCommand({
            Bucket: this.storage.bucket,
            Key: (this.storage.path || "") + key,
        });

        try {
            const { Body } = await this.client.send(command);
            if (!Body) {
                return null;
            }
            const bodyContents = await Body.transformToString('utf-8');

            if (!bodyContents || bodyContents.trim() === '') {
                return {};
            }

            try {
                const parsedData = JSON.parse(bodyContents);
                return parsedData;
            } catch (err) {
                console.error('Error parsing JSON:', err);
                return null;
            }

        } catch (error) {
            if (error instanceof NoSuchKey) {
                return null;
            } else {
                const errorMessage = error instanceof Error ? error.message : 'Unknown S3 error';
                throw new Error(`Failed to fetch user data for ${key}. Reason: ${errorMessage}`);
            }
        }
    }
    async set(key, value) {
        if (!this.client) {
            throw "Client not connected";
        }

        const Bucket = this.storage.bucket;
        const Key = (this.storage.path || "") + key;

        let command;
        if (value === undefined) {
            command = new DeleteObjectCommand({
                Bucket,
                Key
            });
        }
        else {
            command = new PutObjectCommand({
                Bucket,
                Key,
                Body: JSON.stringify(value, null, 2),
                ContentType: 'application/json',
            });
        }

        try {
            await this.client.send(command);
            return true;
        } catch (error) {
            console.error(`Failed to write to bucket: ${Bucket}, key: ${Key}`, error);
            return false;
        }
    }
}

export default StorageS3;
