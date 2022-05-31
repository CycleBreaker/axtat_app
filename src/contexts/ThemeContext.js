import React, { createContext } from "react";
//Helpers
import { lightTheme, darkTheme } from "./themes";

export const ThemeContext = createContext();

export function ThemeContextProvider(props) {
  const [isLightTheme, setLightTheme] = useState(true);
  function switchTheme() {
    setLightTheme(!isLightTheme);
  }

  return (
    <ThemeContext.Provider
      value={{ isLightTheme, switchTheme, lightTheme, darkTheme }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
