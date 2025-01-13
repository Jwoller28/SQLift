module.exports = {
  testEnvironment: 'jsdom',  // Use jsdom for testing React components
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',  // Use babel-jest to transform TypeScript and JSX/TSX files
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],  // Ensure your setupTests.js file is referenced
  testPathIgnorePatterns: ['/node_modules/', '/build/'],  // Ignore unnecessary paths
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',  // Mock CSS imports (if needed)
  },
};