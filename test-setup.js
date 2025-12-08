// Mock S3
const { mockClient } = require('aws-sdk-client-mock');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand, CopyObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');

const s3Mock = mockClient(S3Client);

// Default S3 Mock behavior
s3Mock.on(ListObjectsV2Command).resolves({ KeyCount: 0, Contents: [] });
s3Mock.on(GetObjectCommand).resolves({
    Body: {
        on: (event, callback) => {
            if (event === 'data') callback(Buffer.from('test content'));
            if (event === 'end') callback();
        }
    }
});
s3Mock.on(PutObjectCommand).resolves({});
s3Mock.on(DeleteObjectCommand).resolves({});
s3Mock.on(DeleteObjectsCommand).resolves({});
s3Mock.on(CopyObjectCommand).resolves({});
s3Mock.on(HeadObjectCommand).resolves({});

// Mock Redis
jest.mock('ioredis', () => require('ioredis-mock'));

// Mock MongoDB (Stateful mock)
const mongoStore = new Map();
const mongoMock = {
    connect: jest.fn(),
    db: jest.fn().mockReturnThis(),
    collection: jest.fn().mockReturnThis(),
    insertOne: jest.fn(async (doc) => {
        mongoStore.set(doc.id, doc);
        return { acknowledged: true };
    }),
    replaceOne: jest.fn(async (query, doc, options) => {
        mongoStore.set(doc.id, doc);
        return { acknowledged: true };
    }),
    findOne: jest.fn(async (query) => {
        if (query.id) return mongoStore.get(query.id) || null;
        return null;
    }),
    deleteOne: jest.fn(async (query) => {
        if (query.id) mongoStore.delete(query.id);
        return { acknowledged: true };
    }),
    deleteMany: jest.fn(async (query) => {
        if (Object.keys(query).length === 0) mongoStore.clear();
        return { acknowledged: true };
    }),
    drop: jest.fn(async () => {
        mongoStore.clear();
    }),
    find: jest.fn((query, projection) => {
        const results = Array.from(mongoStore.values());
        const cursor = {
            map: (fn) => {
                const mapped = results.map(fn);
                return {
                    toArray: async () => mapped
                };
            },
            toArray: async () => results
        };
        return cursor;
    }),
    close: jest.fn(),
};

jest.mock('mongodb', () => {
    const mockClient = jest.fn().mockImplementation(() => mongoMock);
    mockClient.connect = jest.fn().mockResolvedValue(mongoMock);
    return {
        MongoClient: mockClient,
        ObjectId: jest.fn(val => val),
    };
});

// Set env vars
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.MONGO_URL = 'mongodb://localhost:27017';
process.env.MONGO_DB = 'test';
process.env.MONGO_COLLECTION = 'test';
process.env.AWS_ACCESS_KEY_ID = 'test';
process.env.AWS_SECRET_ACCESS_KEY = 'test';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_BUCKET_NAME = 'test-bucket';

// S3 vars used by src/Core/Storage/File/S3.js
process.env.S3_ID = 'test';
process.env.S3_SECRET = 'test';
process.env.S3_ENDPOINT = 'https://s3.us-east-1.amazonaws.com';
process.env.S3_BUCKET = 'test-bucket';
process.env.S3_REGION = 'us-east-1';

// Helper to reset mocks
global.s3Mock = s3Mock;
global.mongoMock = mongoMock;
