// ResizeObserver 모킹
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver;

global.DOMRect = {
  fromRect: () => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  }),
} as unknown as typeof DOMRect;

// bun test 환경에서 localStorage/window가 없으므로 목 설정
if (typeof globalThis.localStorage === 'undefined') {
  let store: Record<string, string> = {};

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem(key: string): string | null {
        return Object.hasOwn(store, key) ? store[key] : null;
      },
      setItem(key: string, value: string): void {
        store[key] = String(value);
      },
      removeItem(key: string): void {
        delete store[key];
      },
      clear(): void {
        store = {};
      },
      get length() {
        return Object.keys(store).length;
      },
    },
  });
}

// LocalStorage.ts의 isBrowser 체크(typeof window !== 'undefined')가 true가 되도록 설정
if (typeof globalThis.window === 'undefined') {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: globalThis,
  });
}
