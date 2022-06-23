import '@testing-library/jest-dom';
import { vi } from 'vitest';
import vueSnapshotSerializer from 'jest-serializer-vue';

expect.addSnapshotSerializer(vueSnapshotSerializer);

vi.stubGlobal(
  'matchMedia',
  vi.fn(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
).stubGlobal(
  'IntersectionObserver',
  vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn()
  }))
);
