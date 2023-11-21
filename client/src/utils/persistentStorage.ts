export const getFromStorage = (key: string, defaultValue = null) => {
  const val = localStorage.getItem(key)

  return val ?? defaultValue
}

export const setIntoStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, String(value))
}
