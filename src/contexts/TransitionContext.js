import React, { createContext, useState } from "react";

export const TransitionContext = createContext();

export function TransitionContextProvider(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [transition, setTransition] = useState("moveToRightFromLeft");
  const [enterAnimation, setEnterAnimation] = useState("");
  const [exitAnimation, setExitAnimation] = useState("");

  const pageDirection = function (newPage) {
    if (currentPage > newPage) {
      setTransition("moveToLeftFromRight");
      setEnterAnimation("moveFromLeft");
      setExitAnimation("moveToLeft");
    } else if (currentPage < newPage) {
      setTransition("moveToRightFromLeft");
      setEnterAnimation("moveFromRight");
      setExitAnimation("moveToRight");
    }
    setCurrentPage(newPage);
  };

  return (
    <TransitionContext.Provider
      value={{ transition, enterAnimation, exitAnimation, pageDirection }}
    >
      {props.children}
    </TransitionContext.Provider>
  );
}
