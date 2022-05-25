import { createContext } from "react";
//Helpers
import MediaQueries from "../helpers/MediaQueries";

export const ResolutionContext = createContext();

export function ResolutionContextProvider(props) {
  const [mobileResolution, tabletResolution] = MediaQueries();

  const commonWindowSize = () => {
    return {
      width: tabletResolution ? 800 : "100%",
      m: "0 auto",
      marginTop: "64px",
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
