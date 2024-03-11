import * as React from "react";

// third party libraries
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  FormLabel,
} from "@mui/material";
import { Field, Formik } from "formik";
import * as Yup from "yup";

// style + assets
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveAltRoundedIcon from "@mui/icons-material/SaveAltRounded";
import { alpha, styled, useTheme } from "@mui/material/styles";

// project imports
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchUserDetails,
  fetchUserDetailsById,
  updateUserDetails,
} from "@/store/user/user.actions";
import Certificate from "./components/Certificate";
import ContactInformation from "./components/ContactInformation";
import PermitInfo from "./components/PermitInfo";
import PickUpLocation from "./components/PickUpLocation";
import StudentInformation from "./components/StudentInformation";
import { openAlert } from "@/store/alert/alert.actions";
import { useRouter } from "next/router";

// custom styles
export const InputFormLabel = styled(FormLabel)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "16px",
  color: "#4F5B67",
  fontFamily: theme.typography.button.fontFamily,
  marginBottom: theme.spacing(2),
}));

export const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "32px",
    "&.Mui-focused fieldset": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
      borderWidth: "1px",
    },
    "& > input": {
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 100px #fff inset",
        WebkitTextFillColor: "#212121",
      },
    },
  },
}));

export const PageSection = styled("section")(({ theme }) => ({
  padding: "30px 0",
  "& > h4": {
    color: theme.palette.common.black,
    lineHeight: "32.5px",
    marginBottom: theme.spacing(4),
  },
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// ==============================|| PROFILE INFORMATION VIEW ||============================== //
const ProfileInformation = () => {
  const [value, setValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    scrollToSection(newValue);
  };

  const tabLists = [
    "Student Information",
    "Emergency Contact Information",
    "Pickup Location",
    "Permit Info",
    "Certificate",
  ];

  const scrollToSection = (index: number) => {
    const sectionId = `#field${index + 1}`;
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const theme = useTheme();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;
  React.useEffect(() => {
    if (!id) {
      dispatch(fetchUserDetails());
    } else {
      dispatch(fetchUserDetailsById(id as string));
    }
  }, []);

  const {
    userDetails: { details, loading },
    userDetailsById: { details: detailsById, loading: loadingById },
  } = useAppSelector((store) => store?.user);

  const [editMode, setEditMode] = React.useState(false);
  const [changesMade, setChangesMade] = React.useState(false);

  return (
    <React.Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={id ? loadingById : loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Formik
        initialValues={{
          firstName: id
            ? detailsById?.first_name
            : details?.user?.first_name ?? "",
          lastName: id
            ? detailsById?.last_name
            : details?.user?.last_name ?? "",
          notes: "",
          address: id ? detailsById?.address : details?.profile?.address ?? "",
          unit: id ? detailsById?.apartment : details?.profile?.apartment ?? "",
          city: id ? detailsById?.city : details?.profile?.city ?? "",
          state: id ? detailsById?.state : details?.profile?.state ?? "",
          zip: id ? detailsById?.zip_code : details?.profile?.zip_code ?? "",
          phone: id
            ? detailsById?.cell_phone
            : details?.profile?.cell_phone ?? "",
          gender: id ? detailsById?.gender : details?.profile?.gender ?? "",
          birthDate: id ? detailsById?.dob : details?.profile?.dob ?? "",
          school: id ? detailsById?.school : details?.profile?.school ?? "",
          receiveCertificate: "",
          contactName: "",
          contactRelation: "",
          contactEmail: "",
          contactPhone: "",
          secondContactName: "",
          secondContactRelation: "",
          secondContactEmail: "",
          secondContactPhone: "",
          pickUpLocationName: "",
          pickUpLocationAddress: "",
          pickUpLocationUnit: "",
          pickUpLocationCity: "",
          permitNumber: "",
          permitDateIssued: "",
          permitExpDate: "",
          permitEndorsedBy: "",
          permitEndorsedDate: "",
          pinkCertNum: "",
          pinkCertDate: "",
          pinkCertInst: "",
          pinkCertEndorDate: "",
          goldCertNum: "",
          goldCertDate: "",
          goldCertInst: "",
          goldCertEndorDate: "",
        }}
        validationSchema={Yup.object().shape({})}
        enableReinitialize
        onSubmit={async (
          values,
          { setErrors, setStatus, setSubmitting, setFieldValue }
        ) => {
          const formData = {
            ...values,
            cell_phone: values?.phone,
          };
          delete formData?.phone;
          try {
            if (changesMade) {
              dispatch(
                updateUserDetails(formData, () => {
                  setEditMode(false);
                })
              );
            } else {
              dispatch(openAlert("No any changes made to save", "error"));
              setEditMode(false);
            }
          } catch (err) {
            setStatus({ success: false });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          setFieldValue,
          dirty,
        }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          React.useEffect(() => {
            setChangesMade(dirty);
          }, [dirty]);
          return (
            <React.Fragment>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                spacing={4}
              >
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    aria-label="user-details-tabs"
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      "& .MuiTab-root": {
                        fontSize: "16px",
                        lineHeight: "26px",
                        fontWeight: 600,
                        color: theme.palette.common.black,
                      },
                      "& .MuiTab-root.Mui-selected": {
                        color: "#F37736",
                      },
                    }}
                    TabIndicatorProps={{
                      sx: {
                        backgroundColor: "#F37736",
                      },
                    }}
                  >
                    {tabLists.map((tab, index) => (
                      <Tab label={tab} {...a11yProps(index)} key={index} />
                    ))}
                  </Tabs>
                </Box>

                <Box>
                  <Button
                    variant="contained"
                    endIcon={
                      !editMode ? <EditRoundedIcon /> : <SaveAltRoundedIcon />
                    }
                    sx={{
                      borderRadius: "32px",
                      width: "118px",
                      backgroundColor: editMode
                        ? "primary.dark"
                        : "success.dark",
                      "&:hover": {
                        backgroundColor: editMode
                          ? "primary.dark"
                          : "success.dark",
                      },
                    }}
                    onClick={() => {
                      if (editMode) {
                        handleSubmit();
                      } else {
                        setEditMode(true);
                      }
                    }}
                  >
                    {editMode ? "Save Info" : "Edit Info"}
                  </Button>
                </Box>
              </Stack>
              <form noValidate onSubmit={handleSubmit}>
                <Box
                  sx={{
                    height: "calc(100vh - 300px)",
                    overflowY: "auto",
                    paddingX: 2,
                  }}
                >
                  <StudentInformation
                    touched={touched}
                    errors={errors}
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    editMode={editMode}
                  />

                  <Divider />

                  <ContactInformation
                    touched={touched}
                    errors={errors}
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    editMode={editMode}
                  />

                  <Divider />

                  <PickUpLocation
                    touched={touched}
                    errors={errors}
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    editMode={editMode}
                  />

                  <Divider />

                  <PermitInfo
                    touched={touched}
                    errors={errors}
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    editMode={editMode}
                  />

                  <Divider />

                  <Certificate
                    touched={touched}
                    errors={errors}
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    editMode={editMode}
                  />
                </Box>
              </form>
            </React.Fragment>
          );
        }}
      </Formik>
    </React.Fragment>
  );
};

export default ProfileInformation;
