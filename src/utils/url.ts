export const resetUrlParams = () => {
  window.history.replaceState(null, '', window.location.pathname);
};

export const updateUrlParam = (key: string, value: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState(null, '', url.toString());
};

export const removeUrlParam = (key: string) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.replaceState(null, '', url.toString());
};