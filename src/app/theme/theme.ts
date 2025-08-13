import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#C9A227", // Dourado principal
      contrastText: "#fff",
    },
    secondary: {
      main: "#B38E1E", // Dourado mais escuro
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#f5f5f5",
    },
    text: {
      primary: "#000",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          transition: "background-color 0.25s ease-in-out",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#C9A227",
          },
          "& .MuiOutlinedInput-root": {
            transition: "border-color 0.25s ease-in-out",
            "&:hover fieldset": {
              borderColor: "#F2E2B6", // Hover pérola no campo
            },
            "&.Mui-focused fieldset": {
              borderColor: "#C9A227",
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#C9A227",
          textDecoration: "none",
          transition: "color 0.25s ease-in-out",
          "&:hover": {
            color: "#F2E2B6", // Hover pérola no link
          },
        },
      },
    },
  },
});

export default theme;
