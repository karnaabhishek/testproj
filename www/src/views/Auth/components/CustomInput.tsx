import { InputBase, InputLabel, styled } from "@mui/material";

export const CustomInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 35,
    backgroundColor: "Input Box Stroke Thin",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
  },
}));

export const CustomLabel = styled(InputLabel)(({ theme }) => ({
  color: "#242D35",
  fontSize: 16,
  fontWeight: 600,
  lineHeight: "22px",
  "&.Mui-focused": {
    color: "#242D35",
  },
}));
