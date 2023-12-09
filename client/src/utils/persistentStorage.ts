export const getFromStorage = (key: string, defaultValue: string | null = null) => {
  const val = localStorage.getItem(key)

  return val ?? defaultValue
}

export const setIntoStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
}
