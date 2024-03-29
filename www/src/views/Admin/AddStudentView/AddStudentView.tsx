import { DatePicker } from "@/components/CustomInput";
import { useAppDispatch } from "@/hooks";
import { createUser, fetchUsers } from "@/store/user/user.actions";
import { CustomInput, CustomLabel } from "@/views/Auth/components";
import { InputFormLabel } from "@/views/Client/ProfileView/components/ProfileInformation/ProfileInformation";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";

const AddStudentView = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <Container maxWidth={"md"}>
      <Box
        sx={{
          padding: (theme) => theme.spacing(4),
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "normal",
              pt: "13px",
            }}
            color="secondary"
          >
            Create an account{" "}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.24px",
            }}
          >
            Connect to your Safety First Driving{" "}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Divider
            sx={{
              flexGrow: 1,
              maxWidth: "350px",
            }}
            orientation="horizontal"
          />
        </Box>
        <Grid container spacing={2}></Grid>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            role: "STUDENT",
            gender: "MALE",
            school: [],
            birthDate: "",
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Must be a valid email")
              .max(255)
              .required("Email is required"),
            password: Yup.string().max(255).required("Password is required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password")], "Passwords must match")
              .max(255)
              .required("Confirm Password is required"),
            firstName: Yup.string().max(255).required("First Name is required"),
            lastName: Yup.string().max(255).required("Last Name is required"),
            phoneNumber: Yup.string()
              .max(255)
              .required("Phone Number is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              const formData = {
                first_name: values.firstName,
                // middle_name: "string",
                last_name: values.lastName,
                email: values.email,
                password: values.password,
                role: "STUDENT",
                cell_phone: values.phoneNumber,
                apartment: "string",
                city: "string",
                state: "string",
                gender: values.gender,
                dob: values.birthDate,
                // school: "string",
                address: "string",
              };
              dispatch(
                createUser(formData, () => {
                  dispatch(fetchUsers("STUDENT"));
                  router.push("/manage/student-list");
                })
              );
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setSubmitting(false);
            }
          }}
        >
          {({
            touched,
            errors,
            values,
            handleBlur,
            handleChange,
            isSubmitting,
            handleSubmit,
            setFieldValue,
          }) => {
            return (
              <form>
                {" "}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.firstName && errors.firstName)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="firstName-signup">
                        First Name *
                      </CustomLabel>
                      <CustomInput
                        id="firstName-signup"
                        type="text"
                        value={values.firstName}
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.lastName && errors.lastName)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="lastName-signup">
                        Last Name *
                      </CustomLabel>
                      <CustomInput
                        id="lastName-signup"
                        type="text"
                        value={values.lastName}
                        name="lastName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.email && errors.email)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="email-signup">
                        Email *
                      </CustomLabel>
                      <CustomInput
                        id="email-signup"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="phoneNumber-signup">
                        Phone Number *
                      </CustomLabel>
                      <CustomInput
                        id="phoneNumber-signup"
                        type="text"
                        value={values.phoneNumber}
                        name="phoneNumber"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.password && errors.password)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="password-signup">
                        Password *
                      </CustomLabel>
                      <CustomInput
                        id="password-signup"
                        type="password"
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="confirmPassword-signup">
                        Confirm Password *
                      </CustomLabel>
                      <CustomInput
                        id="confirmPassword-signup"
                        type="password"
                        value={values.confirmPassword}
                        name="confirmPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomLabel shrink htmlFor="gender">
                      Select Gender*
                    </CustomLabel>
                    <FormControl variant="standard" sx={{ width: "100%" }}>
                      <RadioGroup
                        aria-label="gender"
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        row
                      >
                        <FormControlLabel
                          value="MALE"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="FEMALE"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="OTHER"
                          control={<Radio />}
                          label="Other"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomLabel shrink htmlFor="gender">
                      Birth Date*
                    </CustomLabel>
                    <FormControl fullWidth>
                      <DatePicker
                        name="birthDate"
                        value={moment(values?.birthDate)}
                        onChange={(newValue: any) => {
                          let formattedDate =
                            moment(newValue).format("YYYY-MM-DD");

                          setFieldValue("birthDate", formattedDate);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "40px",
                  }}
                >
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="large"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "100px",
                      padding: "12px 0",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "330px",
                      width: "100%",
                    }}
                    onClick={() => handleSubmit()}
                  >
                    Register
                  </Button>
                </Box>
              </form>
            );
          }}
        </Formik>
      </Box>
    </Container>
  );
};

export default AddStudentView;
