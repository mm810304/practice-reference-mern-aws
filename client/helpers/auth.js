import cookie from 'js-cookie';
import Router from 'next/router';

export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 7
    });
  }
};

export const removeCookie = (key, value) => {
  if (process.browser) {
    cookie.remove(key);
  }
};

export const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }

  let token = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${key}=`));
  if (!token) {
    return undefined;
  }

  let tokenValue = token.split('=')[1];

  return tokenValue;
};

export const getCookie = (key, req) => {
  return process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req);
};

export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

export const authenticate = (response, next) => {
  setCookie('token', response.data.token);
  setLocalStorage('user', response.data.user);
  next();
};

export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie('token');
    
    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      } else {
      }
    }
  }
}

export const logout = () => {
  removeCookie('token');
  removeLocalStorage('user');
  Router.push('/login');
};

export const updateUser = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem('user')) {
      let auth = JSON.parse(localStorage.getItem('user'));
      auth = user;
      localStorage.setItem('user', JSON.stringify(auth));
      next();
    }
  }
};