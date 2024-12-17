import { CacheType, createContext } from "reblendjs";

export const theme: {
  [key: string]: { backgroundColor: string; color: string };
} = {
  light: {
    backgroundColor: "white",
    color: "black",
  },
  dark: {
    backgroundColor: "black",
    color: "white",
  },
};

export const activeThemeContext = createContext("light", {
  key: "activeTheme",
  type: CacheType.LOCAL,
});

export const ThemeContext = createContext(theme[activeThemeContext.getValue()]);
