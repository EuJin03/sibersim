// fuzzySearch.ts
export function fuzzySearch(
  query: string,
  items: any[],
  keys: string[]
): any[] {
  const lowerCaseQuery = query.toLowerCase();

  return items.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerCaseQuery);
      }
      return false;
    });
  });
}
