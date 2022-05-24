import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#725056",
      light: "#7c565d",
      dark: "#6d4b52",
      contrastText: "#f5efee",
    },
    secondary: {
      main: "#d7c1b9",
      light: "#d8c3bb",
      dark: "#cfb5ab",
      contrastText: "#1A1C26",
    },
    background: {
      default: "#F3ECEA",
      paper: "#f5efee",
    },
    text: {
      primary: "#1A1C26",
      secondary: "#242735",
      disabled: "#2d3042",
      hint: "#363a4f",
    },
    divider: "#363a4f",
    error: {
      main: "#b0112f",
      light: "#bf1332",
      dark: "#a8112c",
      contrastText: "#f5efee",
    },
    success: {
      main: "#517350",
      light: "#577c56",
      dark: "#4d6d4b",
      contrastText: "#f5efee",
    },
  },
  shape: {
    borderRadius: 16,
  },
  overrides: {
    MuiSwitch: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: 8,
      },
      switchBase: {
        padding: 1,
        "&$checked, &$colorPrimary$checked, &$colorSecondary$checked": {
          transform: "translateX(16px)",
          color: "#fff",
          "& + $track": {
            opacity: 1,
            border: "none",
          },
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 13,
        border: "1px solid #bdbdbd",
        backgroundColor: "#fafafa",
        opacity: 1,
        transition:
          "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#8c1abd",
      light: "#951bca",
      dark: "#8518b3",
      contrastText: "#ffd319",
    },
    secondary: {
      main: "#6111bd",
      light: "#6813c9",
      dark: "#5c10b1",
      contrastText: "#ff901f",
    },
    background: {
      default: "#290c86",
      paper: "#2d0e96",
    },
    text: {
      primary: "#a6f0ff",
      secondary: "#94edff",
      disabled: "#82eaff",
      hint: "#70e7ff",
    },
    divider: "#70e7ff",
    error: {
      main: "#ff1f26",
      light: "#ff353c",
      dark: "#ff020a",
      contrastText: "#70e7ff",
    },
    success: {
      main: "#4aff74",
      light: "#55ff7d",
      dark: "#3cff69",
      contrastText: "#70e7ff",
    },
  },
  shape: {
    borderRadius: 16,
  },
  overrides: {
    MuiSwitch: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: 8,
      },
      switchBase: {
        padding: 1,
        "&$checked, &$colorPrimary$checked, &$colorSecondary$checked": {
          transform: "translateX(16px)",
          color: "#fff",
          "& + $track": {
            opacity: 1,
            border: "none",
          },
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 13,
        border: "1px solid #bdbdbd",
        backgroundColor: "#fafafa",
        opacity: 1,
        transition:
          "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
    },
  },
});
