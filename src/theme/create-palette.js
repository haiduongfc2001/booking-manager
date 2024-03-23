import { common } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import { error, indigo, info, neutral, success, warning } from "./colors";

export function createPalette() {
  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[900], 0.38),
      disabledBackground: alpha(neutral[900], 0.12),
      focus: alpha(neutral[900], 0.16),
      hover: alpha(neutral[900], 0.04),
      selected: alpha(neutral[900], 0.12),
    },
    background: {
      default: neutral[100],
      paper: common.white,
      neutral: {
        50: neutral[50],
        100: neutral[100],
        200: neutral[200],
        300: neutral[300],
        400: neutral[400],
        500: neutral[500],
        600: neutral[600],
        700: neutral[700],
        800: neutral[800],
        900: neutral[900],
      },
      indigo: {
        lightest: indigo.lightest,
        light: indigo.light,
        main: indigo.main,
        dark: indigo.dark,
        darkest: indigo.darkest,
        contrastText: indigo.contrastText,
      },
      success: {
        lightest: success.lightest,
        light: success.light,
        main: success.main,
        dark: success.dark,
        darkest: success.darkest,
        contrastText: success.contrastText,
      },
      info: {
        lightest: info.lightest,
        light: info.light,
        main: info.main,
        dark: info.dark,
        darkest: info.darkest,
        contrastText: info.contrastText,
      },
      warning: {
        lightest: warning.lightest,
        light: warning.light,
        main: warning.main,
        dark: warning.dark,
        darkest: warning.darkest,
        contrastText: warning.contrastText,
      },
      error: {
        lightest: error.lightest,
        light: error.light,
        main: error.main,
        dark: error.dark,
        darkest: error.darkest,
        contrastText: error.contrastText,
      },
    },
    divider: "#F2F4F7",
    error,
    info,
    mode: "light",
    neutral,
    primary: indigo,
    success,
    text: {
      primary: neutral[900],
      secondary: neutral[500],
      tertiary: success.main,
      disabled: alpha(neutral[900], 0.38),
    },
    icon: {
      primary: success.main,
      main: indigo.main,
    },
    border: {
      primary: neutral[400],
    },
    warning,
  };
}
