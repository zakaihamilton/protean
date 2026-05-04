process.env.S3_ID = 'test';
process.env.S3_SECRET = 'test';
process.env.S3_ENDPOINT = 'http://localhost:9000';
process.env.S3_REGION = 'us-east-1';
process.env.S3_BUCKET = 'test-bucket';

import 'fake-indexeddb/auto';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

import {
  testCompare,
  testInstance,
  testMethod,
  testPermutations,
} from '../Util/Test';

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
            const prefix = params.Prefix || '';
            const contents = Array.from(mockS3State.keys())
              .filter((key) => key.startsWith(prefix))
              .map((key) => ({ Key: key }));
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
          if (name === 'DeleteObjectCommand') {
            mockS3State.delete(params.Key);
            return {};
          }
          if (name === 'HeadObjectCommand') {
            if (mockS3State.has(params.Key)) return {};
            const err = new Error('NotFound');
            err.name = 'NotFound';
            throw err;
          }
          if (name === 'CopyObjectCommand') {
            const source = decodeURIComponent(params.CopySource)
              .split('/')
              .slice(1)
              .join('/');
            mockS3State.set(params.Key, mockS3State.get(source));
            return {};
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

import * as StorageFileList from './File/List';
import * as StorageFileS3 from './File/S3';

import * as StorageListLocal from './List/Local';

const implementations = {
  StorageFileList,
  StorageFileS3,
};

const params = {
  StorageFileList: [StorageListLocal],
};

const permutations = testPermutations(implementations, params);

const timeout = 10000;

describe.each(
  permutations,
)('File - %s vs %s', (_source, _target, components, params) => {
  let instances;

  beforeEach(async () => {
    instances = testInstance(components, params);
    testCompare(await testMethod(instances, 'isSupported'));
    await testMethod(instances, 'open');
  }, timeout);

  afterEach(async () => {
    try {
      await testMethod(instances, 'reset');
    } finally {
      await testMethod(instances, 'close');
      mockS3State.clear();
      jest.clearAllMocks();
    }
  }, timeout);

  it('folder lifecycle', async () => {
    await testMethod(instances, 'createFolder', '/test');
    testCompare(await testMethod(instances, 'folderExists', '/test'));
    await testMethod(instances, 'deleteFolder', '/test');
    testCompare(await testMethod(instances, 'folderExists', '/test'));
  });

  it('file lifecycle', async () => {
    await testMethod(instances, 'writeFile', '/test', 'test');
    testCompare(await testMethod(instances, 'fileExists', '/test'));
    testCompare(await testMethod(instances, 'readFile', '/test'));
    await testMethod(instances, 'deleteFile', '/test');
    testCompare(await testMethod(instances, 'fileExists', '/test'));
  });

  it('list', async () => {
    await testMethod(instances, 'createFolder', '/folder');
    await testMethod(instances, 'writeFile', '/folder/test', 'test');
    await testMethod(instances, 'writeFile', '/folder/test2', 'test2');
    testCompare(await testMethod(instances, 'listFolder', '/folder'));
  });
});
