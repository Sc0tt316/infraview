
/**
 * Set a cookie with a specified name, value, and expiration in days
 */
export const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  const cookieArr = document.cookie.split(';');
  
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');
    const cookieName = cookiePair[0].trim();
    
    if (cookieName === name) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  
  return null;
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
};

/**
 * Check if cookies are enabled in the browser
 */
export const areCookiesEnabled = (): boolean => {
  try {
    document.cookie = "testcookie=1";
    const cookieEnabled = document.cookie.indexOf("testcookie") !== -1;
    document.cookie = "testcookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    return cookieEnabled;
  } catch (e) {
    return false;
  }
};
