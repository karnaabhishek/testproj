import { createTheme } from "@mui/material";
import palette from "./palette";
import typography from "./typography";
import componentStyleOverrides from "./compStyleOverride";

// Create a theme instance.
const Theme = createTheme({
  palette,
  typography,
});

Theme.components = componentStyleOverrides(Theme);

export default Theme;
