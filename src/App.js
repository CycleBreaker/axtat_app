import { useState } from "react";
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
//Contexts
import { ResolutionContextProvider } from "./contexts/ResolutionContext";
//Helpers
import { lightTheme, darkTheme } from "./themes";

function App() {
  //Theming
  const [isLightTheme, setLightTheme] = useState(true);
  function switchTheme() {
    setLightTheme(!isLightTheme);
  }

  //Component wrappers
  const FinancesWrapper = function () {
    return (
      <Menus switchTheme={switchTheme} currentTheme={isLightTheme}>
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
      <ResolutionContextProvider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Login />} />
            <Route path="/finances" element={<FinancesWrapper />} />
            <Route path="/statistics" element={<StatisticsWrapper />} />
            <Route path="/settings" element={<SettingsWrapper />} />
          </Routes>
        </BrowserRouter>
      </ResolutionContextProvider>
    </ThemeProvider>
  );
}

export default App;
