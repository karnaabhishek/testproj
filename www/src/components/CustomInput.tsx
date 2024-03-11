import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";

export const DatePicker = styled(MuiDatePicker)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "40px",
    borderRadius: "32px",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: theme.palette.secondary.light,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: theme.palette.secondary.light,
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: theme.palette.secondary.light,
  },
}));
