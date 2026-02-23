/** @type {import("ts-jest").JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/src'],

  testMatch: ['**/tests/integration/**/*.test.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setup/integration.setup.ts"
  ],

  collectCoverage: false,
};