import type { Config } from 'jest';

export default async (): Promise<Config> => {
    return {
        moduleFileExtensions: ['js', 'json', 'ts'],
        testRegex: '.*\\.e2e.spec\\.ts$',
        transform: {
            '^.+\\.(t|j)s$': 'ts-jest',
        },
        collectCoverageFrom: ['**/*.(t|j)s'],
        coverageDirectory: '../coverage',
        testEnvironment: 'node',
        moduleNameMapper: {
            '^@users/(.*)$': '<rootDir>/../src/../src/users/$1',
            '^@db/(.*)$': '<rootDir>/../src/db/$1',
            '^@auth/(.*)$': '<rootDir>/../src/auth/$1',
            '^@config/(.*)$': '<rootDir>/../src/config/$1',
            '^@utility/(.*)$': '<rootDir>/../src/utility/$1',
            '^@health/(.*)$': '<rootDir>/../src/health/$1',
        },
        testTimeout: 100000,
    };
};
