import { Box, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import React from "react";

const InstructorLessonListing = () => {
  const styles = {
    root: {
      border: "1px solid #EAECEE",
      borderRadius: "8px",
      minHeight: "423px",
      width: "100%",
    },
    headerBox: {
      height: "60px",
      background: "#E5E4E4",
      borderRadius: "8px 8px 0px 0px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    formContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "50px",
    },
  };
  return (
    <Box sx={styles.root}>
      <Box sx={styles.headerBox}>
        <Typography
          sx={{ fontWeight: "700", fontSize: "18px", color: "#4F5B67" }}
        >
          CSR Daily Instructor Lesson List Selector
        </Typography>

        <Box sx={styles.formContainer}>
          <Formik
            initialValues={{
              lessonDate: "",
              instructor: "",
            }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ values, handleSubmit, touched, errors }) => {
              return (
                <form noValidate onSubmit={handleSubmit}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                  >
                   
                  </Stack>
                </form>
              );
            }}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorLessonListing;
