import React, { createContext } from "react";
//Helpers
import MediaQueries from "../helpers/MediaQueries";

export const ResolutionContext = createContext();

export function ResolutionContextProvider(props) {
  const [mobileResolution, tabletResolution] = MediaQueries();

  const commonWindowSize = () => {
    return {
      width: tabletResolution ? "100%" : 800,
      m: "0 auto",
      marginTop: mobileResolution ? 0 : "64px",
      boxSizing: "border-box",
      p: 2,
    };
  };

  return (
    <ResolutionContext.Provider
      value={{ mobileResolution, tabletResolution, commonWindowSize }}
    >
      {props.children}
    </ResolutionContext.Provider>
  );
}
