export function createSearchParamsHelper(
  filterParams: Record<string, string[]>,
  basePath: string
): string {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  return `${basePath}${queryString}`;
}