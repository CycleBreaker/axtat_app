import React, { createContext, useState } from "react";

export const TransitionContext = createContext();

export function TransitionContextProvider(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [transition, setTransition] = useState({
    initial: { transform: "translateX(-100%)" },
    animate: { transform: "translateX(0)" },
    exit: { transform: "translateX(100%)" },
  });

  const pageDirection = function (newPage) {
    if (currentPage > newPage) {
      setTransition({
        ...transition,
        initial: { transform: "translateX(-100%)" },
        exit: { transform: "translateX(100%)" },
      });
      setCurrentPage(newPage);
    } else {
      setTransition({
        ...transition,
        initial: { transform: "translateX(100%)" },
        exit: { transform: "translateX(-100%)" },
      });
      setCurrentPage(newPage);
    }
  };

  return (
    <TransitionContext.Provider value={{ transition, pageDirection }}>
      {props.children}
    </TransitionContext.Provider>
  );
}
