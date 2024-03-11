import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const verify = () => {
  return (
    <div>
      <Image src={"/assets/logo.png"} alt="sfds" height={400} width={400} />
      <Box>
        <Typography variant="h3">Email Verified</Typography>
        <Typography variant="h5">
          Thank you for verifying your email address
        </Typography>
      </Box>
    </div>
  );
};

export default verify;
