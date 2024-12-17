import { CacheType, createContext } from "reblendjs";

const AUTH_TOKEN_CONTEXT_KEY = "AUTH_TOKEN_CONTEXT_KEY";
export const authTokenContext = createContext("", {
  key: AUTH_TOKEN_CONTEXT_KEY,
  type: CacheType.LOCAL,
});

export const showLoginContext = createContext(false);

export const netErrContext = createContext(false)
