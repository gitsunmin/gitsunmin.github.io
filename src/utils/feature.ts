let timer
export const debounce = (callback, delay) => {
  return ((...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback?.(args)
    }, delay)
  })()
}
