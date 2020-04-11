module.exports = {
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src',
  ],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  setupFilesAfterEnv: ['jest-enzyme'],
  testEnvironment: 'enzyme',
};
