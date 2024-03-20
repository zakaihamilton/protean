import "fake-indexeddb/auto";
import 'dotenv/config';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val))

import FileSystemStorage from './FileSystem';
import ListStorageDb from "./List/Db";
import ListStorageLocal from "./List/Local";
import ListStorageMemory from "./List/Memory";
import ListStorageRedis from "./List/Redis";

const implementations = [
    ListStorageDb,
    ListStorageLocal,
    ListStorageMemory,
    ListStorageRedis
].map(implementation => ([
    implementation.name, implementation
]));

describe.each(implementations)('FileSystemStorage - %s', (_, implementation) => {
    let listStorage;
    let fileSystemStorage;

    beforeEach(async () => {
        listStorage = new implementation();
        fileSystemStorage = new FileSystemStorage(listStorage);
        await fileSystemStorage.open();
    });

    afterEach(async () => {
        await listStorage.reset();
        await fileSystemStorage.close();
        jest.clearAllMocks();
    });

    it('should create a folder', async () => {
        const folderPath = 'folder:///myFolder';
        listStorage.get = jest.fn().mockImplementation(async (path) => {
            if (path === folderPath) {
                return null;
            }
        });
        listStorage.set = jest.fn();

        await fileSystemStorage.createFolder('/myFolder');

        expect(listStorage.set).toHaveBeenCalledWith(folderPath, {
            path: '/myFolder'
        });
    });

    it('should throw an error when creating an existing folder', async () => {
        const folderPath = 'folder:///myFolder';
        listStorage.get = jest.fn().mockImplementation(async (path) => {
            if (path === folderPath) {
                return { path: '/myFolder' };
            }
        });

        await expect(fileSystemStorage.createFolder('/myFolder')).rejects.toThrow('Folder already exists');
    });

    it('should delete a folder', async () => {
        const folderPath = 'folder:///myFolder';
        listStorage.get = jest.fn().mockImplementation(async (path) => {
            if (path === folderPath) {
                return { path: '/myFolder' };
            }
        });

        listStorage.delete = jest.fn();

        await fileSystemStorage.deleteFolder('/myFolder');

        expect(listStorage.delete).toHaveBeenCalledWith(folderPath);
    });

    it('should read a file', async () => {
        const content = 'Hello, world!';

        await fileSystemStorage.writeFile('/myFile', content);
        const result = await fileSystemStorage.readFile('/myFile');

        expect(result).toBe(content);
    });

    it('should write a file', async () => {
        const filePath = 'file:///myFile';
        const content = 'New content';
        listStorage.set = jest.fn();

        await fileSystemStorage.writeFile('/myFile', content);

        expect(listStorage.set).toHaveBeenCalledWith(filePath, content);
    });

    it('should delete a file', async () => {
        const filePath = 'file:///myFile';
        listStorage.get = jest.fn().mockImplementation(async (path) => {
            if (path === filePath) {
                return { path: '/myFile' };
            }
        });
        listStorage.exists = jest.fn().mockImplementation(async (path) => {
            if (path === filePath) {
                return true;
            }
        });
        listStorage.delete = jest.fn();

        await fileSystemStorage.deleteFile('/myFile');

        expect(listStorage.delete).toHaveBeenCalledWith(filePath);
    });

    it('should move a file', async () => {
        const content = 'File content';
        listStorage.get = jest.fn().mockImplementation(async (path) => {
            if (path === 'file:///fromFile') {
                return content;
            }
        });
        listStorage.exists = jest.fn().mockImplementation(async (path) => {
            if (path === 'file:///fromFile') {
                return true;
            }
        });
        listStorage.set = jest.fn();
        listStorage.delete = jest.fn();

        await fileSystemStorage.moveFile('/fromFile', '/toFile');

        expect(listStorage.set).toHaveBeenCalledWith('file:///toFile', content);
        expect(listStorage.delete).toHaveBeenCalledWith('file:///fromFile');
    });

    it('should copy a file', async () => {
        const content = 'File content';
        listStorage.get = jest.fn().mockImplementation(async (path) => {
            if (path === 'file:///fromFile') {
                return content;
            }
        });
        listStorage.set = jest.fn();

        await fileSystemStorage.copyFile('/fromFile', '/toFile');

        expect(listStorage.set).toHaveBeenCalledWith('file:///toFile', content);
    });

    it('should check if a folder exists', async () => {
        const folderPath = 'folder:///myFolder';
        listStorage.get = jest.fn().mockImplementation(async (path) => {
            if (path === folderPath) {
                return { path: '/myFolder' };
            }
        });

        const result = await fileSystemStorage.folderExists('/myFolder');

        expect(result).toBe(true);
    });

    it('should check if a folder does not exist', async () => {
        const folderPath = 'folder:///myFolder';
        listStorage.get = jest.fn().mockImplementation(async (path) => {
            if (path === folderPath) {
                return null;
            }
        });

        const result = await fileSystemStorage.folderExists('/myFolder');

        expect(result).toBe(false);
    });

    it('should check if a file exists', async () => {
        const filePath = 'file:///myFile';
        listStorage.get = jest.fn().mockImplementation(async (path) => {
            if (path === filePath) {
                return { path: '/myFile' };
            }
        });

        const result = await fileSystemStorage.fileExists('/myFile');

        expect(result).toBe(true);
    });

    it('should check if a file does not exist', async () => {
        const filePath = 'file:///myFile';
        listStorage.get = jest.fn().mockImplementation(async (path) => {
            if (path === filePath) {
                return null;
            }
        });

        const result = await fileSystemStorage.fileExists('/myFile');

        expect(result).toBe(false);
    });

    it('should move a folder', async () => {
        await fileSystemStorage.createFolder('/fromFolder');
        await fileSystemStorage.moveFolder('/fromFolder', '/toFolder');

        expect(await fileSystemStorage.folderExists('/toFolder')).toBe(true);
        expect(await fileSystemStorage.folderExists('/fromFolder')).toBe(false);
    });

    it('should copy a folder', async () => {
        await fileSystemStorage.createFolder('/fromFolder');
        await fileSystemStorage.copyFolder('/fromFolder', '/toFolder');

        expect(await fileSystemStorage.folderExists('/toFolder')).toBe(true);
        expect(await fileSystemStorage.folderExists('/fromFolder')).toBe(true);
    });
});
