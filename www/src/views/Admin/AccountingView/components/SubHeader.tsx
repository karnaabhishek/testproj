import React from "react";

// third party libraries
import { Box, Button, Stack, Typography } from "@mui/material";

// style + assets
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// ==============================|| SUB HEADER ||============================== //
const SubHeader = () => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      width={"100%"}
      py={4}
    >
      <Box>
        <Typography variant="h3">Statements and Invoicing</Typography>
        <Typography variant="body1">
          Your payment and subscription details
        </Typography>
      </Box>
      <Box>
        <Button
          variant="contained"
          endIcon={<AddRoundedIcon />}
          sx={{
            backgroundColor: "#C4C4C4",
            borderRadius: "32px",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#C4C4C4",
            },
          }}
        >
          Resend New Password
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1E293B",
            color: "#fff",
            borderRadius: "32px",
            "&:hover": {
              backgroundColor: "#1E293B",
            },
          }}
        >
          Print Record
        </Button>
      </Box>
    </Stack>
  );
};

export default SubHeader;
