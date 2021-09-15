module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  verbose: true,
  testPathIgnorePatterns: ['/build/'],
  collectCoverageFrom: ['./src/**'],
  setupFiles: ['dotenv/config']
}
