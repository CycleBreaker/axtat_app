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
import { UserDataContextProvider } from "./contexts/UserDataContext";

function App() {
  return (
    <ThemeContextProvider>
      <ResolutionContextProvider>
        <TransitionContextProvider>
          <UserDataContextProvider>
            <CssBaseline />
            <BrowserRouter>
              <Menus>
                <AnimatedRoutes />
              </Menus>
            </BrowserRouter>
          </UserDataContextProvider>
        </TransitionContextProvider>
      </ResolutionContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
