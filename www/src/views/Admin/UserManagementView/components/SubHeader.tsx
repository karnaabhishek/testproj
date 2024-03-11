import React from "react";

// style + assets
import SearchIcon from "@mui/icons-material/Search";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// third party libraries
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Toolbar,
} from "@mui/material";
import CustomDialog from "./Dialog";
import { Formik } from "formik";
import * as Yup from "yup";
import { CustomInput, CustomLabel } from "@/views/Auth/components";
import { register } from "@/store/auth/auth.actions";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks";
import { useDispatch } from "react-redux";
import { createUser, fetchUsers } from "@/store/user/user.actions";

// ==============================|| SUB HEADER ||============================== //

const SubHeader = ({ sortBy, handleSortChange }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAcceptDialog = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle="Add New User"
        isFormikForm
      >
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            role: "INSTRUCTOR",
            school: [],
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
                role: values.role,
                cell_phone: values.phoneNumber,
                apartment: "string",
                city: "string",
                state: "string",
                gender: "MALE",
                dob: "2024-02-28",
                school: ["sfds"],
                address: "string",
              };
              dispatch(
                createUser(formData, () => {
                  setOpenDialog(false);
                  dispatch(fetchUsers("ALL"));
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
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.role && errors.role)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel
                        shrink
                        htmlFor="confirmPassword-signup"
                        variant="standard"
                      >
                        Role*
                      </CustomLabel>
                      <Select
                        id="role-select"
                        value={values.role}
                        label="Age"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="role"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "dark.main",
                          fontFamily: (theme) =>
                            theme.typography.button.fontFamily,
                          borderRadius: "32px",
                          height: "43px",
                        }}
                      >
                        <MenuItem value={"INSTRUCTOR"}>Instructor</MenuItem>
                        <MenuItem value={"CSR"}>CSR</MenuItem>
                      </Select>
                      {touched.role && errors.role && (
                        <FormHelperText>{errors.role}</FormHelperText>
                      )}
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
                      maxWidth: "120px",
                      width: "100%",
                    }}
                    onClick={() => handleSubmit()}
                  >
                    Add
                  </Button>
                </Box>
              </form>
            );
          }}
        </Formik>
      </CustomDialog>
      <Box
        sx={{
          background: "var(--Base-background-white, #FFF)",
          boxShadow: "0px -1px 0px 0px #F1F1F1 inset",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Box display={"flex"} gap={"20px"} alignItems={"center"}>
            <TextField
              size="small"
              placeholder="Name or Email"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "32px",
                },
              }}
            />
            {/* <TextField
              size="small"
              placeholder="City"
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: "32px",
                  maxWidth: "130px",
                },
              }}
            />
            <TextField
              size="small"
              placeholder="State"
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: "32px",
                  maxWidth: "135px",
                },
              }}
            />

            <Button
              variant="outlined"
              size="small"
              sx={{
                minHeight: 38,
                borderRadius: "32px",
                borderColor: "secondary.light",
                color: "var(--Gray-900, #0C1116)",
                minWidth: 122,
              }}
              endIcon={<FilterListRoundedIcon />}
            >
              More filter
            </Button>

            <Button
              variant="contained"
              color="backgroundColor"
              sx={{
                background: "primary.light",
                border: "1px solid #EAECEE",
                boxShadow: "none",
                color: "#111",
                borderRadius: "32px",
                "&.Mui-disabled": {
                  background: "var(--Gray-50, #FAFAFA)",
                },
              }}
              disabled
            >
              Clear All Filter
            </Button> */}
          </Box>

          <Box display={"flex"} gap={"20px"} alignItems={"center"}>
            {/* <FormControl
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                minWidth: "131px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sortBy}
                onChange={handleSortChange}
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "dark.main",
                  fontFamily: (theme) => theme.typography.button.fontFamily,
                  borderRadius: "32px",
                }}
              >
                <MenuItem value="Sort by Date">Sort by date</MenuItem>
                <MenuItem value="Sort by Name">Sort by name</MenuItem>
              </Select>
            </FormControl> */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "32px",
              }}
              endIcon={<AddRoundedIcon />}
              onClick={() => setOpenDialog(true)}
            >
              New User
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </>
  );
};

export default SubHeader;
