import useMediaQuery from "@mui/material/useMediaQuery";

export default function MediaQueries() {
  const mobileResolution = useMediaQuery("(min-width:500px)", { noSsr: true });
  const tabletResolution = useMediaQuery("(min-width:900px)", { noSsr: true });

  return [mobileResolution, tabletResolution];
}
