const nextJest = require("next/jest");
const createJestConfig = nextJest({
    dir: "./",
});
const customJestConfig = {
    moduleDirectories: ["node_modules", "<rootDir>/"],
    testMatch: ["<rootDir>/src/**/*.test.js"],
    testEnvironment: "jest-environment-jsdom",
    setupFiles: [
        "./jest.polyfills.js",
        "./test-setup.js",
        "dotenv/config"
    ],
    moduleNameMapper: {
        "^bson$": require.resolve("bson"),
        "^sinon$": require.resolve("sinon"),
    },
    transformIgnorePatterns: [
        "/node_modules/(?!(mongodb|bson)/)"
    ],
};
module.exports = createJestConfig(customJestConfig);
