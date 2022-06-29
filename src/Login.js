import React, { useContext } from "react";
import "./Login.css";
//App components
import Footer from "./Footer";
//Material UI elements
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";

export default function Login() {
  //Responsiveness
  const { mobileResolution } = useContext(ResolutionContext);

  //Grow in timeout={2000} easing={{ enter: "cubic-bezier(.28,.11,.27,1)" }}
  //<Slide direction="up" in mountOnEnter unmountOnExit timeout={1000}>

  return (
    <React.Fragment>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "85vh",
          zIndex: 2,
        }}
      >
        <Paper
          sx={{
            height: "500px",
            width: mobileResolution ? "90%" : "500px",
            position: "absolute",
            top: mobileResolution ? "-50px" : 0,
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
          className="tilt-in-bottom"
        >
          <Box>
            <Typography variant="h3" align="center">
              Welcome to Axtat!
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
      </Container>
      <Footer />
    </React.Fragment>
  );
}
