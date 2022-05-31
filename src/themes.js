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
  breakpoints: {
    values: {
      sm: 500,
    },
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
      main: "#8557C7",
      light: "#9c75d1",
      dark: "#703DB8",
      contrastText: "#FFE75C",
    },
    secondary: {
      main: "#D93250",
      light: "#DF536C",
      dark: "#BE233F",
      contrastText: "#FFE033",
    },
    background: {
      default: "#121212",
      paper: "#1F1F1F",
    },
    text: {
      primary: "#EBFFFF",
      secondary: "#d6ffff",
      disabled: "#c2ffff",
      hint: "#ADFFFF",
    },
    divider: "#99EEFF",
    error: {
      main: "#ff1f26",
      light: "#ff353c",
      dark: "#ff020a",
      contrastText: "#70e7ff",
    },
    success: {
      main: "#77F2AC",
      light: "#A2F6C6",
      dark: "#58EE99",
      contrastText: "#C9ACF2",
    },
  },
  shape: {
    borderRadius: 16,
  },
  breakpoints: {
    values: {
      sm: 500,
    },
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
