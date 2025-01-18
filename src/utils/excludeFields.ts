export function excludeFields<T, Key extends keyof T>(
  obj: T,
  keys: Key[],
): Omit<T, Key> {
  const newObj = { ...obj };
  for (const key of keys) {
    delete newObj[key];
  }
  return newObj;
}
