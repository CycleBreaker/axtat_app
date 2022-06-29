import React, { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
//App Components
import Login from "./Login";
import Finances from "./Finances";
import Statistics from "./Statistics";
import Settings from "./Settings";
//Transition animation
import { PageTransition } from "@steveeeie/react-page-transition";
import { TransitionContext } from "./contexts/TransitionContext";

export default function AnimatedRoutes() {
  const location = useLocation();
  const { transition, enterAnimation, exitAnimation } =
    useContext(TransitionContext);

  return (
    <PageTransition
      preset={transition}
      enterAnimation={enterAnimation}
      exitAnimation={exitAnimation}
      transitionKey={location.pathname}
    >
      <Routes location={location} key={location.pathname}>
        <Route path="*" element={<Login />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </PageTransition>
  );
}
