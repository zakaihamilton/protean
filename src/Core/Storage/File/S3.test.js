process.env.S3_ID = 'test';
process.env.S3_SECRET = 'test';
process.env.S3_ENDPOINT = 'http://localhost:9000';
process.env.S3_REGION = 'us-east-1';
process.env.S3_BUCKET = 'test-bucket';

const PAGE_SIZE = 2;
const mockS3State = new Map();

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(async (command) => {
          const name = command.constructor.name;
          const params = command.input;
          if (name === 'ListObjectsV2Command') {
            const prefix = params.Prefix || '';
            const matching = Array.from(mockS3State.keys()).filter((key) =>
              key.startsWith(prefix),
            );
            const start = params.ContinuationToken
              ? Number(params.ContinuationToken)
              : 0;
            const page = matching
              .slice(start, start + PAGE_SIZE)
              .map((Key) => ({ Key }));
            const nextIndex = start + PAGE_SIZE;
            return {
              Contents: page,
              KeyCount: page.length,
              NextContinuationToken:
                nextIndex < matching.length ? String(nextIndex) : undefined,
            };
          }
          if (name === 'DeleteObjectsCommand') {
            const deleted = [];
            for (const obj of params.Delete.Objects) {
              mockS3State.delete(obj.Key);
              deleted.push({ Key: obj.Key });
            }
            return { Deleted: deleted };
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
    DeleteObjectsCommand: class DeleteObjectsCommand {
      constructor(input) {
        this.input = input;
      }
    },
    CopyObjectCommand: class CopyObjectCommand {
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
    HeadObjectCommand: class HeadObjectCommand {
      constructor(input) {
        this.input = input;
      }
    },
  };
});

import * as StorageFileS3 from './S3';

describe('StorageFileS3 pagination', () => {
  beforeEach(async () => {
    mockS3State.clear();
    await StorageFileS3.open();
    for (let i = 1; i <= 5; i += 1) {
      mockS3State.set(`/src/file${i}`, `content-${i}`);
    }
    mockS3State.set('/other/keep', 'keep');
  });

  afterEach(async () => {
    await StorageFileS3.close();
    mockS3State.clear();
    jest.clearAllMocks();
  });

  it('listFolder awaits all ContinuationToken pages', async () => {
    const items = await StorageFileS3.listFolder('/src');
    expect(items).toEqual([
      { Key: '/src/file1' },
      { Key: '/src/file2' },
      { Key: '/src/file3' },
      { Key: '/src/file4' },
      { Key: '/src/file5' },
    ]);
  });

  it('copyFolder awaits all ContinuationToken pages', async () => {
    const count = await StorageFileS3.copyFolder('/src', '/dest');
    expect(count).toBe(5);
    expect(await StorageFileS3.listFolder('/dest')).toEqual([
      { Key: '/dest/file1' },
      { Key: '/dest/file2' },
      { Key: '/dest/file3' },
      { Key: '/dest/file4' },
      { Key: '/dest/file5' },
    ]);
  });

  it('deleteFolder awaits all ContinuationToken pages', async () => {
    const count = await StorageFileS3.deleteFolder('/src');
    expect(count).toBe(5);
    expect(await StorageFileS3.listFolder('/src')).toEqual([]);
    expect(mockS3State.has('/other/keep')).toBe(true);
  });

  it('reset awaits all ContinuationToken pages', async () => {
    const count = await StorageFileS3.reset();
    expect(count).toBe(6);
    expect(mockS3State.size).toBe(0);
  });
});
