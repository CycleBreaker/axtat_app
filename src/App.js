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

import MediaQueries from "./helpers/MediaQueries";

function App() {
  const [mobileResolution, tabletResolution] = MediaQueries();

  //Theming
  const [isLightTheme, setLightTheme] = useState(true);
  function switchTheme() {
    setLightTheme(!isLightTheme);
  }

  //Component wrappers
  const FinancesWrapper = function () {
    return (
      <Menus
        switchTheme={switchTheme}
        currentTheme={isLightTheme}
        mobileResolution={mobileResolution}
      >
        <Finances />
      </Menus>
    );
  };
  const StatisticsWrapper = function () {
    return (
      <Menus switchTheme={switchTheme} currentTheme={isLightTheme}>
        <Statistics />
      </Menus>
    );
  };
  const SettingsWrapper = function () {
    return (
      <Menus switchTheme={switchTheme} currentTheme={isLightTheme}>
        <Settings />
      </Menus>
    );
  };

  return (
    <ThemeProvider theme={isLightTheme ? lightTheme : darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Menus
          switchTheme={switchTheme}
          currentTheme={isLightTheme}
          mobileResolution={mobileResolution}
        >
          <Routes>
            <Route path="*" element={<Login />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Menus>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

//Удалить Wrappers, если с выносом меню за их пределы ничего не поломается
