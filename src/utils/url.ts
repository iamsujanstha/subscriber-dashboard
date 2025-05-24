export const resetUrlParams = (key: string) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.replaceState(null, '', url.toString());
};
