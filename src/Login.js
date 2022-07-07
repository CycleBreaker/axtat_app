import React, { useContext, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
//App components
import Footer from "./Footer";
//Material UI elements
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";
import { UserDataContext } from "./contexts/UserDataContext";
//Firebase
import firebase from "firebase/compat/app";
import { firebaseAuthObj, authentication } from "./firebaseConfig";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  //Responsiveness
  const { mobileResolution } = useContext(ResolutionContext);
  //User data storage
  const { setUser } = useContext(UserDataContext);

  //AUTHENTICATIONS

  //Firebase UI
  const FirebaseSignIn = function () {
    setPersistence(authentication, browserLocalPersistence).then(() => {
      return;
    });
    useEffect(() => {
      firebase.auth().onAuthStateChanged(function (usr) {
        if (usr) {
          navigate("/finances");
        } else {
          const theFirebaseUI =
            firebaseui.auth.AuthUI.getInstance() ||
            new firebaseui.auth.AuthUI(firebaseAuthObj);
          theFirebaseUI.start(".firebase-auth-container", {
            callbacks: {
              signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                console.log(authResult);
                //Set session token in sessionStorage
                sessionStorage.setItem(
                  "AuthToken",
                  authResult.user.refreshToken
                );
                download;
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                return false;
              },
              uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                //document.getElementById("loader").style.display = "none";
              },
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: mobileResolution ? "redirect" : "popup",
            signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
          });
        }
      });
    }, []);
  };

  //Check if the user is already authenticated
  /*
  useEffect(() => {
    if (sessionStorage.getItem("AuthToken")) {
      navigate("/finances");
    }
  }, []);
  */

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
          <FirebaseSignIn />
          <div className="firebase-auth-container" />
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

/*
{
    "user": {
        "uid": "0lPGARslEHaYd1NvKciYWgK2QrB3",
        "email": "bronislav.svrv@gmail.com",
        "emailVerified": true,
        "displayName": "Bronislav Suvorov",
        "isAnonymous": false,
        "photoURL": "https://lh3.googleusercontent.com/a-/AOh14GgxURW5v4rnU2MYmMkUcUaoi34v-iQM0yxvHvKb=s96-c",
        "providerData": [
            {
                "providerId": "google.com",
                "uid": "114711737374057005372",
                "displayName": "Bronislav Suvorov",
                "email": "bronislav.svrv@gmail.com",
                "phoneNumber": null,
                "photoURL": "https://lh3.googleusercontent.com/a-/AOh14GgxURW5v4rnU2MYmMkUcUaoi34v-iQM0yxvHvKb=s96-c"
            }
        ],
        "stsTokenManager": {
            "refreshToken": "AIwUaOkJ8iPd9Q3F4XmQlM9QWG0lXYN0WBKDTIxqP4eE7L6q1jFc7m6xra3PY5fuvDU-JrOvBpEF-gO0vuP8g9rO82YrwSETJtUa3IPHYOh3uqY5g4qDntxYWhWGm_lKlvRDfpKYgYtSjqgrQuX1K8_AA0SX87-btMWbxxpTfZskTa9VogLKyWrLn2u6XJaVZwBFoOiyjDt8NLhUvvDGPBF4SdTpLFVqRAAA1-V2NanDsvpXee6RDl-ve_uAVVgYJOCYZv8uz41xDihXIxgxwnsRGD19hfrPDYK7fhZUqLqaQcsIeH_MWcW6jpG1HoXIVKLSguE_7Ew1h15j86PpDeKjM1HnBxvsveKSZ63ugSEzdMSvBE6gfFMv9_YQ2bIcnXS_1ngKK_g62bMFAivp-Z98kZ1jRkdc0cCCjp3PplawWdvOO5U3PgQ",
            "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUwYTdhYTlkNzg5MmI1MmE4YzgxMzkwMzIzYzVjMjJlMTkwMzI1ZDgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQnJvbmlzbGF2IFN1dm9yb3YiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2d4VVJXNXY0cm5VMk1ZbU1rVWNVYW9pMzR2LWlRTTB5eHZIdktiPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2F4dGF0LWI2YmZjIiwiYXVkIjoiYXh0YXQtYjZiZmMiLCJhdXRoX3RpbWUiOjE2NTY2OTQzMDgsInVzZXJfaWQiOiIwbFBHQVJzbEVIYVlkMU52S2NpWVdnSzJRckIzIiwic3ViIjoiMGxQR0FSc2xFSGFZZDFOdktjaVlXZ0syUXJCMyIsImlhdCI6MTY1NjY5NDMwOCwiZXhwIjoxNjU2Njk3OTA4LCJlbWFpbCI6ImJyb25pc2xhdi5zdnJ2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTE0NzExNzM3Mzc0MDU3MDA1MzcyIl0sImVtYWlsIjpbImJyb25pc2xhdi5zdnJ2QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.mVTVrKQ94fZajK6-Y-2kotFI8odAT9IDG97UOqpacoYkdtlQj2we_ibLW33_O7fD7XtZnA2XcFCZqUvQecLu4l-00bAv9x6xMmUcs9bMfnIuffDV70fLa_KG1Du0tczj6v0z_cntYB0ns9MsmmjClE1-40QOu-jy9TeS1VxQhlR0NydZxBAkpcNtmOs-2QSNyEOyLfil-kIzAvyvGShTgWEhqKUhuVdipBd6-gDjJjGGJKqUfI_XnJGfa4CrQ57S1DyfvAvLIuHxS9ZSk8Zi3prgIwV9MM6og3d_UPuCzDUMXW82FiYazUYUWdAkE6Vmz3q-fRKxVAGXXEn7bl1EhA",
            "expirationTime": 1656697909082
        },
        "apiKey": "AIzaSyBpZQW0zHFLHRqjsl9WE-D0SEPAMNoIqrg",
        "appName": "[DEFAULT]"
    },
    "credential": {
        "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI2NTBhMmNlNDdiMWFiM2JhNDA5OTc5N2Y4YzA2ZWJjM2RlOTI4YWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjQ5NDcwMDE5OTc2LTJlbDBhN3R2MW9jYjI2NDlmdHVidGxlMmVlaDhtM2lqLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjQ5NDcwMDE5OTc2LTJlbDBhN3R2MW9jYjI2NDlmdHVidGxlMmVlaDhtM2lqLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE0NzExNzM3Mzc0MDU3MDA1MzcyIiwiZW1haWwiOiJicm9uaXNsYXYuc3ZydkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImRHdHNEYnpiQ3V4bEpYbC1MOTFzMkEiLCJpYXQiOjE2NTY2OTQzMDgsImV4cCI6MTY1NjY5NzkwOH0.lm1ZmNNv_rv76NUeha4Yqsl3PUbZW_Qbk9b-OYvRbT13TMWzs0CDz8mbDBW-KogK8APll0sa_00SbIh5vpwj0I-PcGXkhNa1nz0cuUYKXLSC6md1NxBqdvCEgniHQn7LLAo6o_23xNBtmqpE9SFCFwpgrI2Sgt7MraPEYU7GOJF21RIkAE04vw_HCRVfEOqM1DVIpFx1cbkmqDc1nULrLAk-pNNN8Q623Yys49KgW5jm2lIXdWXGXOpJNPsWfOUzoQfHzfh6mqiLcd7bd4nW4saVOVSQKRNAC56kwSl6_NMDEpkm7ksgyLYwJPZOnya8lT-gn3KpA6puwrw2SPn6kg",
        "accessToken": "ya29.A0ARrdaM_qBRz5518oWPmu1jAdxOVn9BvhdZ-oTNqQBpL49gBUhUUX7jbEfzJbRmnxa2LezHryMaYH0KF870CV6rXCnoNSYBRO8ZHo8CKIhXjJZPNmpfuxj8n93X_SETWW46Clfs44N3TR8xCpXRqkpc3WaFcyEAYUNnWUtBVEFTQVRBU0ZRRl91NjFWNnlvYW45c0hmMmNjT2k5OHQzZ2dOdw0165",
        "pendingToken": null,
        "providerId": "google.com",
        "signInMethod": "google.com"
    },
    "operationType": "signIn",
    "additionalUserInfo": {
        "isNewUser": false,
        "providerId": "google.com",
        "profile": {
            "name": "Bronislav Suvorov",
            "granted_scopes": "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
            "id": "114711737374057005372",
            "verified_email": true,
            "given_name": "Bronislav",
            "locale": "en",
            "family_name": "Suvorov",
            "email": "bronislav.svrv@gmail.com",
            "picture": "https://lh3.googleusercontent.com/a-/AOh14GgxURW5v4rnU2MYmMkUcUaoi34v-iQM0yxvHvKb=s96-c"
        }
    }
}
*/
