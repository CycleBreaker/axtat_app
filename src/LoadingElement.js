import React from "react";
//MUI elements
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function LoadingElement() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        direction="column"
        spacing={3}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <CircularProgress color="primary" />
        <Typography>Fetching your data...</Typography>
      </Stack>
    </Box>
  );
}
