export function setTokenCookie(token: string) {
  const maxAge = 7 * 24 * 60 * 60;
  const encoded = encodeURIComponent(token);
  document.cookie = `token=${encoded}; Secure; SameSite=None; path=/; max-age=${maxAge}`;
}

export function setCookie(name: string, data: string) {
  const maxAge = 7 * 24 * 60 * 60;
  const encoded = encodeURIComponent(data);
  document.cookie = `${name}=${encoded}; Secure; SameSite=None; path=/; max-age=${maxAge}`;
}

export function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function deleteTokenCookie() {
  document.cookie = `token=; Secure; SameSite=None; path=/; max-age=0`;
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Secure; SameSite=None; path=/; max-age=0`;
};
