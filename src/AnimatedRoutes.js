import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
//App Components
import Login from "./Login";
import Finances from "./Finances";
import Statistics from "./Statistics";
import Settings from "./Settings";
//Transition animation
import { AnimatePresence } from "framer-motion";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="*" element={<Login />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AnimatePresence>
  );
}
