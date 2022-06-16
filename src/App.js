import React from "react";
import { BrowserRouter } from "react-router-dom";
//MUI elements
import CssBaseline from "@mui/material/CssBaseline";
//App Components
import Menus from "./Menus";
import AnimatedRoutes from "./AnimatedRoutes";
//Context providers
import { ResolutionContextProvider } from "./contexts/ResolutionContext";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { TransitionContextProvider } from "./contexts/TransitionContext";
import { SettingsContextProvider } from "./contexts/SettingsContext";

function App() {
  return (
    <ThemeContextProvider>
      <SettingsContextProvider>
        <ResolutionContextProvider>
          <TransitionContextProvider>
            <CssBaseline />
            <BrowserRouter>
              <Menus>
                <AnimatedRoutes />
              </Menus>
            </BrowserRouter>
          </TransitionContextProvider>
        </ResolutionContextProvider>
      </SettingsContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
