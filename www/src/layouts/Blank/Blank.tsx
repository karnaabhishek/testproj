import React from "react";

// third party imports
import { Box } from "@mui/material";

interface BlankProps {
  children: React.ReactNode;
}

// ==============================|| BLANK LAYOUT ||============================== //
const Blank = ({ children }: BlankProps) => {
  return (
    <Box height={"100vh"}>
      <main
        style={{
          height: "100%",
        }}
      >
        {children}
      </main>
    </Box>
  );
};

export default Blank;
