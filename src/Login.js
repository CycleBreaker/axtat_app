import React from "react";
//Material UI elements
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";

export default function Login() {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grow in timeout={2000} easing={{ enter: "cubic-bezier(.28,.11,.27,1)" }}>
        <Paper
          sx={{
            height: "500px",
            width: "500px",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
          elevation={9}
        >
          <Box>
            <Typography variant="h3" align="center">
              Welcome to the App!
            </Typography>
            <Typography variant="h4" align="center">
              Please log in
            </Typography>
          </Box>
          <Box
            sx={{
              p: 3,
              display: "inline-block",
              border: "1px solid black",
              borderRadius: "25px",
            }}
          >
            Login with Google
          </Box>
          <Box
            sx={{
              p: 3,
              display: "inline-block",
              border: "1px solid black",
              borderRadius: "25px",
            }}
          >
            Login with Facebook
          </Box>
          <Box
            sx={{
              p: 3,
              display: "inline-block",
              border: "1px solid black",
              borderRadius: "25px",
            }}
          >
            Demo mode
          </Box>
        </Paper>
      </Grow>
    </Container>
  );
}
