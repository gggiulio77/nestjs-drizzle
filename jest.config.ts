import type { Config } from 'jest';

export default async (): Promise<Config> => {
    return {
        moduleFileExtensions: ['js', 'json', 'ts'],
        rootDir: 'src',
        testRegex: '.*\\.spec\\.ts$',
        // testPathIgnorePatterns: ['<rootDir>/app.e2e.spec.ts'],
        transform: {
            '^.+\\.(t|j)s$': 'ts-jest',
        },
        collectCoverageFrom: ['**/*.(t|j)s'],
        coverageDirectory: '../coverage',
        testEnvironment: 'node',
        moduleNameMapper: {
            '^@users/(.*)$': '<rootDir>/users/$1',
            '^@db/(.*)$': '<rootDir>/db/$1',
            '^@auth/(.*)$': '<rootDir>/auth/$1',
            '^@config/(.*)$': '<rootDir>/config/$1',
            '^@utility/(.*)$': '<rootDir>/utility/$1',
            '^@health/(.*)$': '<rootDir>/health/$1',
        },
        testTimeout: 100000,
    };
};
