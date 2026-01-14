const LOCAL_STORAGE_TYPES = {
  darkMode: ['false', 'true'] as const,
};

type LocalStorageInUse = {
  [key in keyof typeof LOCAL_STORAGE_TYPES]: (typeof LOCAL_STORAGE_TYPES)[key][number];
};

const isBrowser = typeof window !== 'undefined';

export const LocalStorage = {
  get: (key: keyof LocalStorageInUse): string | null => {
    if (!isBrowser) {
      return null; // Return null in SSR environment
    }
    const value = localStorage.getItem(key);
    return value; // Return null if not found, otherwise return the value
  },
  set: (
    key: keyof LocalStorageInUse,
    value: LocalStorageInUse[keyof LocalStorageInUse],
  ) => {
    if (!isBrowser) {
      return; // Do nothing in SSR environment
    }
    if (LOCAL_STORAGE_TYPES[key].includes(value)) {
      localStorage.setItem(key, value);
    } else {
      console.warn(
        `Invalid value for ${key}: ${value}. Expected one of ${LOCAL_STORAGE_TYPES[key].join(', ')}`,
      );
    }
  },
};
