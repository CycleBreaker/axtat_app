import React from "react";
import "./Footer.css";
//MUI elements
import Box from "@mui/material/Box";

export default function Footer() {
  return (
    <Box
      sx={{
        height: "128px",
        textAlign: "center",
        pt: 5,
        zIndex: 1,
      }}
      className="puff-in-center"
    >
      Crafted by Etcetera Team
    </Box>
  );
}
