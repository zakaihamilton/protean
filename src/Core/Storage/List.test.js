import "fake-indexeddb/auto";

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

import { testCompare, testInstance, testMethod, testPermutations, testResults } from "../Util/Test";

import ListStorageDb from "./List/Db";
import ListStorageLocal from "./List/Local";
import ListStorageMemory from "./List/Memory";
import ListStorageRedis from "./List/Redis";
import ListStorageS3 from "./List/S3";
import ListStorageMongo from "./List/Mongo";

const implementations = [
    ListStorageRedis,
    ListStorageS3,
    ListStorageMongo,
    ListStorageDb,
    ListStorageLocal,
    ListStorageMemory
];

const permutations = testPermutations(implementations);

describe.each(permutations)('List - %s vs %s', (_source, _target, components) => {
    let instances;

    beforeEach(async () => {
        await testResults(await testMethod(components, 'isSupported'), (result, index) => {
            if (!result) {
                throw new Error("Storage is not supported", components[index]);
            }
        });

        instances = testInstance(components);
        await testMethod(instances, 'open');
    }, 10000);

    afterEach(async () => {
        await testMethod(instances, 'reset');
        await testMethod(instances, 'close');
        jest.clearAllMocks();
    }, 10000);

    it('set and get', async () => {
        await testMethod(instances, 'set', 'key', 'value');
        testCompare(await testMethod(instances, 'get', 'key'));
        await testMethod(instances, 'exists', 'key');
        await testMethod(instances, 'delete', 'key');
        testCompare(await testMethod(instances, 'get', 'key'));
    });

    it('list', async () => {
        await testMethod(instances, 'set', 'key1', 'value1');
        await testMethod(instances, 'set', 'key2', 'value2');
        testCompare(await testMethod(instances, 'keys'));
    })
});
