import { Theme } from "@mui/material/styles";

export default function componentStyleOverrides(theme: Theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: theme.palette.secondary.light,
          },
          "& label.Mui-focused": {
            color: theme.palette.secondary.light,
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: theme.palette.secondary.light,
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: theme.palette.secondary.light,
            },
            "&:hover fieldset": {
              borderColor: theme.palette.secondary.light,
              borderWidth: "0.15rem",
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.secondary.light,
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: theme.palette.secondary.light,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& fieldset.MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.secondary.light,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.secondary.light,
          },
        },
      },
    },
    // MuiAvatar: {
    //   styleOverrides: {
    //     root: {
    //       color: theme.colors?.primaryDark,
    //       background: theme.colors?.primary200,
    //     },
    //   },
    // },
  };
}
