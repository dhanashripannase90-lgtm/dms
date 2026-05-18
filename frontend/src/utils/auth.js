const AUTH_KEY = "dms_auth";

export const saveAuthData = (data) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
};

export const getAuthData = () => {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getToken = () => getAuthData()?.token;
export const getRole = () => getAuthData()?.role;
export const isAuthenticated = () => Boolean(getToken());
