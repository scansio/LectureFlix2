import { CacheType, createContext } from "reblendjs";
const AUTH_TOKEN_CONTEXT_KEY = "AUTH_TOKEN_CONTEXT_KEY";
export const authTokenContext = createContext("", {
  key: AUTH_TOKEN_CONTEXT_KEY,
  type: CacheType.LOCAL,
});
export const versionContext = createContext("");
export const serverContext = createContext("");
export const modelsContext = createContext<Map<string, string>>(new Map());

export const addModel = ({ model, tag }: { model: string; tag: string }) =>
  modelsContext.update((prev) => {
    prev.set(tag, model);
    return prev;
  }, true);

export enum View {
  NONE,
  HISTORY,
  REST,
  CUSTOM,
}

export const viewContext = createContext<View>(View.HISTORY, {
  type: CacheType.LOCAL,
  key: "viewContext",
});
