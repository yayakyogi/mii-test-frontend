/* eslint-disable @typescript-eslint/no-explicit-any */
export function paramsToObject(entries: any) {
  const results: any = {};

  for (const [key, value] of entries) {
    results[key] = value;
  }

  return results;
}
