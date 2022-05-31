import React, { useState, createContext } from "react";
//MUI elements
import { ThemeProvider } from "@mui/material/styles";
//Helpers
import { lightTheme, darkTheme } from "../themes";

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
      <ThemeProvider theme={isLightTheme ? lightTheme : darkTheme}>
        {props.children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
