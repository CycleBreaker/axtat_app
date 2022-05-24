import useMediaQuery from "@mui/material/useMediaQuery";

export default function MediaQueries() {
  const mobileResolution = useMediaQuery("(min-width:500px)");
  const tabletResolution = useMediaQuery("(min-width:900px)");

  return [mobileResolution, tabletResolution];
}
