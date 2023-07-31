import "fake-indexeddb/auto";
import '@testing-library/jest-dom';
// Import the StorageLocal class and other required functions for testing
import StorageLocal from "../Local";
import { deleteDatabase, getRecord } from "../../Util/IndexedDB";

describe("StorageLocal", () => {
    let storage;

    beforeAll(async () => {
        // Open a test database and create the necessary object stores
        storage = new StorageLocal("TestFileSystem");
        await storage.init();
    });

    afterAll(async () => {
        // Clean up after the tests by deleting the test database
        await deleteDatabase("TestFileSystem");
    });

    describe("createFolder", () => {
        it("should create a new folder in the database", async () => {
            const folderPath = "/test-folder";
            await storage.createFolder(folderPath);

            // Verify that the folder was created successfully by checking if it exists
            const folder = await getRecord(storage.db.transaction("folders").objectStore("folders"), folderPath);
            console.log("folder", folder);
            expect(folder).toBeDefined();
            expect(folder.path).toBe(folderPath);
        });
    });

    describe("deleteFolder", () => {
        it("should delete a folder from the database along with its contents", async () => {
            // Create a folder and some files within it for testing
            const folderPath = "/test-folder";
            await storage.createFolder(folderPath);
            await storage.writeFile("/test-folder/file1.txt", "File content 1");
            await storage.writeFile("/test-folder/file2.txt", "File content 2");

            // Delete the folder and its contents
            await storage.deleteFolder(folderPath);

            // Verify that the folder and files were deleted from the database
            const folder = await storage.db.transaction("folders").objectStore("folders").get(folderPath);
            const file1 = await storage.db.transaction("files").objectStore("files").get("/test-folder/file1.txt");
            const file2 = await storage.db.transaction("files").objectStore("files").get("/test-folder/file2.txt");
            expect(folder).toBeUndefined();
            expect(file1).toBeUndefined();
            expect(file2).toBeUndefined();
        });
    });

    describe("writeFile", () => {
        it("should create a new file in the database", async () => {
            const filePath = "/test-file.txt";
            const content = "File content";
            await storage.writeFile(filePath, content);

            // Verify that the file was created successfully by checking its content
            const file = await storage.db.transaction("files").objectStore("files").get(filePath);
            const data = await storage.db.transaction("data").objectStore("data").get(file.data);
            expect(file).toBeDefined();
            expect(file.path).toBe(filePath);
            expect(data).toBe(content);
        });
    });

    describe("deleteFile", () => {
        it("should delete a file from the database", async () => {
            // Create a file for testing
            const filePath = "/test-file.txt";
            const content = "File content";
            await storage.writeFile(filePath, content);

            // Delete the file
            await storage.deleteFile(filePath);

            // Verify that the file was deleted from the database
            const file = await storage.db.transaction("files").objectStore("files").get(filePath);
            expect(file).toBeUndefined();
        });
    });

    describe("readFile", () => {
        it("should read the content of a file from the database", async () => {
            const filePath = "/test-file.txt";
            const content = "File content";
            await storage.writeFile(filePath, content);

            // Read the file and verify its content
            const fileContent = await storage.readFile(filePath);
            expect(fileContent).toBe(content);
        });
    });

    describe("moveFile", () => {
        it("should move a file to a different folder in the database", async () => {
            // Create a file for testing
            const sourceFilePath = "/test-file.txt";
            const content = "File content";
            await storage.writeFile(sourceFilePath, content);

            // Move the file to a new path
            const targetFilePath = "/new-folder/test-file.txt";
            await storage.moveFile(sourceFilePath, targetFilePath);

            // Verify that the file was moved successfully
            const sourceFile = await storage.db.transaction("files").objectStore("files").get(sourceFilePath);
            const targetFile = await storage.db.transaction("files").objectStore("files").get(targetFilePath);
            expect(sourceFile).toBeUndefined();
            expect(targetFile).toBeDefined();
        });
    });

    describe("moveFolder", () => {
        it("should move a folder to a different location in the database", async () => {
            // Create a folder and some files within it for testing
            const sourceFolderPath = "/test-folder";
            await storage.createFolder(sourceFolderPath);
            await storage.writeFile("/test-folder/file1.txt", "File content 1");
            await storage.writeFile("/test-folder/file2.txt", "File content 2");

            // Move the folder to a new path
            const targetFolderPath = "/new-folder";
            await storage.moveFolder(sourceFolderPath, targetFolderPath);

            // Verify that the folder and its contents were moved successfully
            const sourceFolder = await storage.db.transaction("folders").objectStore("folders").get(sourceFolderPath);
            const targetFolder = await storage.db.transaction("folders").objectStore("folders").get(targetFolderPath);
            const file1 = await storage.db.transaction("files").objectStore("files").get("/new-folder/file1.txt");
            const file2 = await storage.db.transaction("files").objectStore("files").get("/new-folder/file2.txt");
            expect(sourceFolder).toBeUndefined();
            expect(targetFolder).toBeDefined();
            expect(file1).toBeDefined();
            expect(file2).toBeDefined();
        });
    });

    describe("copyFile", () => {
        it("should copy a file to a different location in the database", async () => {
            // Create a file for testing
            const sourceFilePath = "/test-file.txt";
            const content = "File content";
            await storage.writeFile(sourceFilePath, content);

            // Copy the file to a new path
            const targetFilePath = "/new-folder/test-file.txt";
            await storage.copyFile(sourceFilePath, targetFilePath);

            // Verify that the file was copied successfully
            const sourceFile = await storage.db.transaction("files").objectStore("files").get(sourceFilePath);
            const targetFile = await storage.db.transaction("files").objectStore("files").get(targetFilePath);
            expect(sourceFile).toBeDefined();
            expect(targetFile).toBeDefined();
            expect(targetFile.data).not.toBe(sourceFile.data); // Verify that the data was duplicated, not moved
        });
    });

    describe("copyFolder", () => {
        it("should copy a folder and its contents to a different location in the database", async () => {
            // Create a folder and some files within it for testing
            const sourceFolderPath = "/test-folder";
            await storage.createFolder(sourceFolderPath);
            await storage.writeFile("/test-folder/file1.txt", "File content 1");
            await storage.writeFile("/test-folder/file2.txt", "File content 2");

            // Copy the folder to a new path
            const targetFolderPath = "/new-folder";
            await storage.copyFolder(sourceFolderPath, targetFolderPath);

            // Verify that the folder and its contents were copied successfully
            const sourceFolder = await storage.db.transaction("folders").objectStore("folders").get(sourceFolderPath);
            const targetFolder = await storage.db.transaction("folders").objectStore("folders").get(targetFolderPath);
            const file1 = await storage.db.transaction("files").objectStore("files").get("/new-folder/file1.txt");
            const file2 = await storage.db.transaction("files").objectStore("files").get("/new-folder/file2.txt");
            expect(sourceFolder).toBeDefined();
            expect(targetFolder).toBeDefined();
            expect(file1).toBeDefined();
            expect(file2).toBeDefined();
            expect(file1.data).not.toBe(file2.data); // Verify that the file data was duplicated, not moved
        });
    });

    describe("listFilesInFolder", () => {
        it("should list files in a folder from the database", async () => {
            // Create a folder and some files within it for testing
            const folderPath = "/test-folder";
            await storage.createFolder(folderPath);
            await storage.writeFile("/test-folder/file1.txt", "File content 1");
            await storage.writeFile("/test-folder/file2.txt", "File content 2");

            // List files in the folder
            const filesInFolder = await storage.listFilesInFolder(folderPath);

            // Verify that the list contains the file paths
            expect(filesInFolder).toContain("/test-folder/file1.txt");
            expect(filesInFolder).toContain("/test-folder/file2.txt");
        });
    });
});
