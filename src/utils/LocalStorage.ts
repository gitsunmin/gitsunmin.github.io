const LOCAL_STORAGE_TYPES = {
  darkMode: ['false', 'true'] as const,
};

type LocalStorageInUse = {
  [key in keyof typeof LOCAL_STORAGE_TYPES]: (typeof LOCAL_STORAGE_TYPES)[key][number];
};

const DefaultLocalStorage: LocalStorageInUse = {
  darkMode: 'false',
};

export const LocalStorage = {
  get: (key: keyof LocalStorageInUse) => {
    const value = localStorage.getItem(key);

    if (value === null) return DefaultLocalStorage[key];
    else {
      console.warn(
        `Invalid value for ${key}: ${value}. Expected one of ${LOCAL_STORAGE_TYPES[key].join(', ')}`,
      );
      return value;
    }
  },
  set: (
    key: keyof LocalStorageInUse,
    value: LocalStorageInUse[keyof LocalStorageInUse],
  ) => {
    if (LOCAL_STORAGE_TYPES[key].includes(value)) {
      localStorage.setItem(key, value);
    } else
      console.warn(
        `Invalid value for ${key}: ${value}. Expected one of ${LOCAL_STORAGE_TYPES[key].join(', ')}`,
      );
  },
};
