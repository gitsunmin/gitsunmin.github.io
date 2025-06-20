// ResizeObserver 모킹
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 전역 객체에 ResizeObserver 추가
global.ResizeObserver = MockResizeObserver;

// 추가로 필요한 경우 DOMRect 모킹
global.DOMRect = {
  fromRect: () => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0
  })
} as unknown as typeof DOMRect;
