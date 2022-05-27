import useMediaQuery from "@mui/material/useMediaQuery";

export default function MediaQueries() {
  const mobileResolution = useMediaQuery("(max-width:500px)", { noSsr: true });
  const tabletResolution = useMediaQuery("(max-width:900px)", { noSsr: true });

  return [mobileResolution, tabletResolution];
}
