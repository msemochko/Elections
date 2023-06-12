import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getBackendURL } from './Urls';
import ReactGA from 'react-ga';
import versionData from '../../package.json';

const version: string = versionData.version.trim();

export const add = (a: number, b: number): number => {
  return a + b;
};

axiosRetry(axios, { retries: 5 });

export const api = axios.create({
  baseURL: getBackendURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export type AnalyticsEvent = {
  category: string;
  action: string;
};

export const recordEvent = async (input: AnalyticsEvent) => {
  ReactGA.event(input);
};

// DO NOT USE AXIOS OUTSIDE OF THIS PAGE.
// Instead, import the 'api' object exported from this file.

// Token Info
// Access Token expires after five minutes.
// Refresh Token expires after 14 days.

// Build URLs
// const registrationURL = `${backendUrl}/rest-auth/registration/`;
const refreshURL = `/jwt-auth/token/refresh/`;

export function getAccessToken() {
  const token = localStorage.getItem(`token-${version}`) || '';
  const expiry =
    new Date(
      Date.parse(localStorage.getItem(`token-expiry-${version}`) || '')
    ) || undefined;
  const data = {
    token: token,
    expiry: expiry,
  };
  return data;
}

export function getRefreshToken() {
  const token = localStorage.getItem(`refresh-token-${version}`) || '';
  const expiry =
    new Date(
      Date.parse(localStorage.getItem(`refresh-token-expiry-${version}`) || '')
    ) || undefined;

  const data = {
    refreshToken: token,
    refreshTokenExpiry: expiry,
  };
  return data;
}

export function setNewAccessToken(token: string) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  localStorage.setItem(`token-${version}`, token);
  localStorage.setItem(`token-expiry-${version}`, now.toISOString());
}

export function setNewRefreshToken(token: string) {
  const now = new Date(Date.now() + 12096e5); // Now + two weeks in ms.
  localStorage.setItem(`refresh-token-${version}`, token);
  localStorage.setItem(`refresh-token-expiry-${version}`, now.toISOString());
}

export async function clearTokens(): Promise<void> {
  // console.log('Clearing credentials from storage...');
  localStorage.removeItem(`token-${version}`);
  localStorage.removeItem(`token-expiry-${version}`);
  localStorage.removeItem(`refresh-token-${version}`);
  localStorage.removeItem(`refresh-token-expiry-${version}`);
  return;
}

/**
 * Ensures auth is up to date, and returns access token if it's fine.
 */
export async function preRequestRefreshAuth(): Promise<string> {
  return isAuthenticated()
    .then(() => {
      const { token } = getAccessToken();
      return token;
    })
    .catch((err) => {
      console.error(err);
      return '';
    });
}

export async function isAuthenticated(): Promise<boolean> {
  // If the access token is valid, return true immediately.
  if (isAccessTokenValid()) {
    return true;
  }
  // If the refresh token is valid, attempt to get a new access token.
  if (isRefreshTokenValid()) {
    // console.log('Getting new access token using refresh token...');
    const refreshToken =
      localStorage.getItem(`refresh-token-${version}`) || null;
    if (refreshToken == null) throw new Error('No stored refresh token.');

    try {
      const response = await api.post(refreshURL, {
        refresh: refreshToken,
      });
      // Response should contain new access token.
      if (response.data.access) {
        // console.log('Success, got new access token.');
        setNewAccessToken(response.data.access);
        return true;
      } else {
        // console.log('Failure, please log in again.');
        throw new Error('No access token in refresh response.');
      }
    } catch (err) {
      console.error(err);
      throw new Error('Could not fetch new token.');
    }
  }
  // console.log('Refresh token not valid, user is not authenticated.');
  clearTokens();
  return false;
}

export function isAccessTokenValid() {
  const { token, expiry } = getAccessToken();
  if (token == null || expiry == null) return false;
  return isExpiryDateValid(expiry);
}

export function isRefreshTokenValid() {
  const { refreshToken, refreshTokenExpiry } = getRefreshToken();
  if (refreshToken == null || refreshTokenExpiry == null) return false;
  return isExpiryDateValid(refreshTokenExpiry);
}

export function isExpiryDateValid(date: Date | number) {
  const now = new Date();
  if (date instanceof Date) {
    const valid = date.getTime() >= now.getTime();
    return valid;
  } else if (typeof date === 'number') {
    const valid = date >= now.getTime();
    return valid;
  }
  console.error('Provided date is invalid.');
  return false;
}
