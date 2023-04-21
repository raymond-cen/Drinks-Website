import { createTheme } from "@mui/material";

const appTheme = createTheme({
  palette: {
    primary: {
      main: "#EFDABD",
      light: "#FAEBD9",
      dark: "#C8957C",
    },
    secondary: {
      main: "#88504D",
      dark: "#4B0F20",
      contrastText: "#C7DAE1",
    },
    error: {
      main: "#C07373",
      light: "#EAABAB",
      dark: "#972E2E",
      contrastText: "#000000",
    },
    warning: {
      main: "#DAC881",
      light: "#F2E5B5",
      dark: "#A37E26",
      contrastText: "#000000",
    },
    info: {
      main: "#4A86A7",
      light: "#8FBED8",
      dark: "#206388",
      contrastText: "#000000",
    },
    success: {
      main: "#85B464",
      light: "#BFE7A4",
      dark: "#51882B",
      contrastText: "#000000",
    },
    text: {
      primary: "#000000",
    },
  },
  typography: {
    // FIXME: 4vw is >40px, which is massive
    // fontSize: '4vw',
    color: "#4B0F20",
    fontFamily: "acumin-pro-condensed, sans-serif",
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          backgroundColor: "#EFDABD",
          color: "#4B0F20",
        },
      },
    },
    MuiCheckbox: {
      variants: [
        {
          props: { checked: true },
          style: {
            color: "#84A59D",
          },
        },
        {
          props: { checked: false },
          style: {
            color: "#E7C081",
          },
        },
      ],
    },
  },
});

export default appTheme;
