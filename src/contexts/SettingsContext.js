import React, { createContext, useState } from "react";

export const SettingsContext = createContext();

export function SettingsContextProvider(props) {
  const [chosenCurrency, setChosenCurrency] = useState({
    name: "Ukrainian Hryvnia",
    symbol: "₴",
    code: "UAH",
  });

  return (
    <SettingsContext.Provider value={{ chosenCurrency, setChosenCurrency }}>
      {props.children}
    </SettingsContext.Provider>
  );
}
