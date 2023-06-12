import { createContext } from 'react';

export const add = (a: number, b: number): number => {
  return a + b;
};

export type CredentialData = {
  authenticated: boolean | undefined;
  token: string;
  tokenExpiry: Date | undefined;
  refreshToken: string;
  refreshTokenExpiry: Date | undefined;
};

export const blankCredentialData: CredentialData = {
  authenticated: true,
  token: 'qwwqeqweqw',
  tokenExpiry: undefined,
  refreshToken: 'qweqweqwewqe',
  refreshTokenExpiry: undefined,
};

export interface CredentialInterface {
  credentials: CredentialData;
  setCredentials: (x: CredentialData) => void;
}

// Context Object
export const Credentials = createContext<CredentialInterface | null>(null);
