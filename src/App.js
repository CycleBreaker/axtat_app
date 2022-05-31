import React, { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
//MUI elements
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
//App Components
import Login from "./Login";
import Menus from "./Menus";
import Finances from "./Finances";
import Statistics from "./Statistics";
import Settings from "./Settings";
//Helpers
import { lightTheme, darkTheme } from "./themes";
//Context providers
import { ResolutionContextProvider } from "./contexts/ResolutionContext";
import { ThemeContextProvider } from "./contexts/ThemeContext";

function App() {
  //Theming
  const [isLightTheme, setLightTheme] = useState(true);
  function switchTheme() {
    setLightTheme(!isLightTheme);
  }

  //Wrappers
  function SettingsWrapper() {
    return <Settings switchTheme={switchTheme} isLightTheme={isLightTheme} />;
  }

  return (
    <ThemeProvider theme={isLightTheme ? lightTheme : darkTheme}>
      <ResolutionContextProvider>
        <CssBaseline />
        <BrowserRouter>
          <Menus switchTheme={switchTheme} currentTheme={isLightTheme}>
            <Routes>
              <Route path="*" element={<Login />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/settings" element={<SettingsWrapper />} />
            </Routes>
          </Menus>
        </BrowserRouter>
      </ResolutionContextProvider>
    </ThemeProvider>
  );
}

export default App;
