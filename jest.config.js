const nextJest = require("next/jest");
const createJestConfig = nextJest({
    dir: "./",
});
const customJestConfig = {
    moduleDirectories: ["node_modules", "<rootDir>/"],
    testMatch: ["<rootDir>/src/**/*.test.js"],
    testEnvironment: "jest-environment-jsdom",
    setupFiles: [
        "dotenv/config"
    ],
    moduleNameMapper: {
        // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
        "uuid": require.resolve('uuid')
    },
};
module.exports = createJestConfig(customJestConfig);
