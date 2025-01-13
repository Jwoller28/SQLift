import '@testing-library/jest-dom';
// jest.setup.js
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder and TextDecoder globally for Jest tests
global.TextEncoder = TextEncoder;