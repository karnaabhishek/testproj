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
import { fetchUsers } from "@/store/user/user.actions";

// ==============================|| SUB HEADER ||============================== //

const SubHeader = ({
  sortBy,
  handleSortChange,
  setSearchQuery,
  searchQuery,
}: any) => {
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
        dialogTitle="Add New Student"
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
                last_name: values.lastName,
                email: values.email,
                password: values.password,
                role: "STUDENT",
              };
              dispatch(
                register(formData, () => {
                  setOpenDialog(false);
                  dispatch(fetchUsers("STUDENT"));
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
            type ValuesKey =
              | "firstName"
              | "lastName"
              | "email"
              | "password"
              | "confirmPassword"
              | "phoneNumber";

            interface Field {
              id: string;
              type: string;
              label: string;
              name: ValuesKey; // use the type here
              error: boolean;
            }

            const formFields: Field[] = [
              {
                id: "firstName-signup",
                type: "text",
                name: "firstName",
                label: "First Name *",
                error: Boolean(touched.firstName && errors.firstName),
              },
              {
                id: "lastName-signup",
                type: "text",
                name: "lastName",
                label: "Last Name *",
                error: Boolean(touched.lastName && errors.lastName),
              },
              {
                id: "email-signup",
                type: "email",
                name: "email",
                label: "Email *",
                error: Boolean(touched.email && errors.email),
              },
              {
                id: "phoneNumber-signup",
                type: "text",
                name: "phoneNumber",
                label: "Phone Number *",
                error: Boolean(touched.phoneNumber && errors.phoneNumber),
              },
              {
                id: "password-signup",
                type: "password",
                name: "password",
                label: "Password *",
                error: Boolean(touched.password && errors.password),
              },
              {
                id: "confirmPassword-signup",
                type: "password",
                name: "confirmPassword",
                label: "Confirm Password *",
                error: Boolean(
                  touched.confirmPassword && errors.confirmPassword
                ),
              },
            ];
            return (
              <form>
                {" "}
                <Grid container spacing={2}>
                  {formFields.map((field) => (
                    <Grid item xs={12} sm={6} key={field.id}>
                      <FormControl
                        variant="standard"
                        error={field.error}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={field.id}>
                          {field.label}
                        </CustomLabel>
                        <CustomInput
                          id={field.id}
                          type={field.type}
                          value={values[field.name]}
                          name={field.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                        />
                      </FormControl>
                    </Grid>
                  ))}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {/* Filters will be implemented later */}
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
              onClick={() => router.push("/manage/add-new-student")}
            >
              New Student
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </>
  );
};

export default SubHeader;
