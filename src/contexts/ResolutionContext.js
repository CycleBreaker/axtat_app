import { createContext } from "react";
//Helpers
import MediaQueries from "../helpers/MediaQueries";

export const ResolutionContext = createContext();

const [mobileResolution, tabletResolution] = MediaQueries();
export function ResolutionContextProvider(props) {
  return (
    <ResolutionContext.Provider value={{ mobileResolution, tabletResolution }}>
      {props.children}
    </ResolutionContext.Provider>
  );
}
/*
export const useCommonWindowSize = () => {
  return {
    width: tabletResolution ? 800 : "100%",
    m: "0 auto",
    boxSizing: "border-box",
    p: 2,
  };
};
*/
