import "fake-indexeddb/auto";

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

import { testCompare, testInstance, testMethod, testPermutations, testResults } from "../Util/Test";

import StorageListDb from "./List/Db";
import StorageListLocal from "./List/Local";
import StorageListMemory from "./List/Memory";
import StorageListRedis from "./List/Redis";
import StorageListS3 from "./List/S3";
import StorageListMongo from "./List/Mongo";

const implementations = [
    StorageListRedis,
    StorageListS3,
    StorageListMongo,
    StorageListDb,
    StorageListLocal,
    StorageListMemory
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
    }, 10000);

    it('list', async () => {
        await testMethod(instances, 'set', 'key1', 'value1');
        await testMethod(instances, 'set', 'key2', 'value2');
        testCompare(await testMethod(instances, 'keys'));
    }, 10000);
});
