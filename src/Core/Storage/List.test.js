process.env.REDIS_URL = 'redis://localhost:6379';
process.env.MONGO_URL = 'mongodb://localhost:27017';
process.env.MONGO_DB = 'test';
process.env.MONGO_COLLECTION = 'test-collection';
process.env.S3_ID = 'test';
process.env.S3_SECRET = 'test';
process.env.S3_ENDPOINT = 'http://localhost:9000';
process.env.S3_REGION = 'us-east-1';
process.env.S3_BUCKET = 'test-bucket';

import 'fake-indexeddb/auto';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

const mockRedisState = new Map();
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: jest.fn((key) => mockRedisState.get(key)),
      set: jest.fn((key, val) => {
        mockRedisState.set(key, val);
        return 'OK';
      }),
      exists: jest.fn((key) => (mockRedisState.has(key) ? 1 : 0)),
      del: jest.fn((key) => {
        mockRedisState.delete(key);
        return 1;
      }),
      keys: jest.fn((_pattern) => Array.from(mockRedisState.keys())),
      flushall: jest.fn(() => {
        mockRedisState.clear();
        return 'OK';
      }),
      quit: jest.fn(() => 'OK'),
    };
  });
});

const mockMongoState = new Map();
jest.mock('mongodb', () => {
  const mCollection = {
    findOne: jest.fn(async (query) => {
      const id = query.id;
      return mockMongoState.get(id);
    }),
    replaceOne: jest.fn(async (query, doc, _options) => {
      const id = query.id;
      mockMongoState.set(id, doc);
      return { matchedCount: 1 };
    }),
    deleteOne: jest.fn(async (query) => {
      const id = query.id;
      mockMongoState.delete(id);
      return { deletedCount: 1 };
    }),
    find: jest.fn(() => {
      const results = Array.from(mockMongoState.values());
      const cursor = {
        map: jest.fn((fn) => {
          const mapped = results.map(fn);
          return { toArray: async () => mapped };
        }),
        toArray: async () => results,
      };
      return cursor;
    }),
    drop: jest.fn(async () => {
      mockMongoState.clear();
      return true;
    }),
  };
  const mDb = {
    collection: jest.fn(() => mCollection),
  };
  const mClient = {
    connect: jest.fn(async () => mClient),
    db: jest.fn(() => mDb),
    close: jest.fn(async () => {}),
  };
  return { MongoClient: mClient };
});

const mockS3State = new Map();
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(async (command) => {
          const name = command.constructor.name;
          const params = command.input;
          if (name === 'PutObjectCommand') {
            mockS3State.set(params.Key, params.Body);
            return {};
          }
          if (name === 'GetObjectCommand') {
            const data = mockS3State.get(params.Key);
            return {
              Body: {
                on: (event, cb) => {
                  if (event === 'data')
                    setTimeout(() => cb(Buffer.from(data)), 0);
                  if (event === 'end') setTimeout(() => cb(), 10);
                },
              },
            };
          }
          if (name === 'ListObjectsV2Command') {
            const contents = Array.from(mockS3State.keys()).map((key) => ({
              Key: key,
            }));
            return { Contents: contents, KeyCount: contents.length };
          }
          if (name === 'DeleteObjectsCommand') {
            const deleted = [];
            for (const obj of params.Delete.Objects) {
              mockS3State.delete(obj.Key);
              deleted.push({ Key: obj.Key });
            }
            return { Deleted: deleted };
          }
          return {};
        }),
        destroy: jest.fn(),
      };
    }),
    ListObjectsV2Command: class ListObjectsV2Command {
      constructor(input) {
        this.input = input;
      }
    },
    PutObjectCommand: class PutObjectCommand {
      constructor(input) {
        this.input = input;
      }
    },
    GetObjectCommand: class GetObjectCommand {
      constructor(input) {
        this.input = input;
      }
    },
    DeleteObjectCommand: class DeleteObjectCommand {
      constructor(input) {
        this.input = input;
      }
    },
    DeleteObjectsCommand: class DeleteObjectsCommand {
      constructor(input) {
        this.input = input;
      }
    },
    HeadObjectCommand: class HeadObjectCommand {
      constructor(input) {
        this.input = input;
      }
    },
    CopyObjectCommand: class CopyObjectCommand {
      constructor(input) {
        this.input = input;
      }
    },
  };
});

// Clear state after each test
afterEach(() => {
  mockRedisState.clear();
  mockMongoState.clear();
  mockS3State.clear();
});

import {
  testCompare,
  testInstance,
  testMethod,
  testPermutations,
} from '../Util/Test';

import * as StorageListDb from './List/Db';
import * as StorageListLocal from './List/Local';
import * as StorageListMemory from './List/Memory';
import * as StorageListMongo from './List/Mongo';
import * as StorageListRedis from './List/Redis';
import * as StorageListS3 from './List/S3';

const implementations = {
  StorageListRedis,
  StorageListDb,
  StorageListS3,
  StorageListLocal,
  StorageListMongo,
  StorageListMemory,
};

const permutations = testPermutations(implementations);

const timeout = 10000;

describe.each(
  permutations,
)('List - %s vs %s', (_source, _target, components) => {
  let instances;

  beforeEach(async () => {
    instances = testInstance(components);
    await testMethod(instances, 'isSupported');
    await testMethod(instances, 'open');
  }, timeout);

  afterEach(async () => {
    try {
      await testMethod(instances, 'reset');
    } finally {
      await testMethod(instances, 'close');
      jest.clearAllMocks();
    }
  }, timeout);

  it(
    'set and get',
    async () => {
      await testMethod(instances, 'set', 'key', 'value');
      testCompare(await testMethod(instances, 'get', 'key'));
      await testMethod(instances, 'exists', 'key');
      await testMethod(instances, 'deleteKey', 'key');
      testCompare(await testMethod(instances, 'get', 'key'));
    },
    timeout,
  );

  it(
    'list',
    async () => {
      await testMethod(instances, 'set', 'key1', 'value1');
      await testMethod(instances, 'set', 'key2', 'value2');
      testCompare(await testMethod(instances, 'keys'));
    },
    timeout,
  );
});
