import React, { Fragment } from "react";

// third party libraries
import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import { useSelector } from "react-redux";

// style + assets
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

// project imports
import SubHeader from "./components/SubHeader";
import ProfileInformation from "./components/ProfileInformation";
import TransactionsSection from "./components/Transactions";
import ActivitiesSection from "./components/Activities";
import TrainingAndEducationSection from "./components/TrainingAndEducation";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchUserDetailsById } from "@/store/user/user.actions";

const CustomTabLabel = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    orientation="vertical"
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  marginTop: "40px",
  gap: "30px",
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-flexContainerVertical": {
    gap: "13px",
  },
});

interface StyledTabProps {
  label: any;
  icon?: any;
  iconPosition?: any;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab
    disableRipple
    {...props}
    icon={props?.icon}
    iconPosition={props?.iconPosition}
  />
))(({ theme }) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#E0E2E3",
  borderRadius: "6px",
  minWidth: "100%",
  minHeight: "66px",
  "&.Mui-selected": {
    borderColor: "#5E38B5",
    "& > div > div": {
      border: "6px solid #5E38B5",
    },
  },
  "&.Mui-focusVisible": {},
}));

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

// ==============================|| CLIENT PROFILE VIEW ||============================== //
const ClientProfileView = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const router = useRouter();
  const { id } = router.query;
  const user = useSelector((state: any) => state.auth?.currentUser?.user);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (id) {
      dispatch(fetchUserDetailsById(id as string));
    }
  }, []);

  const {
    userDetailsById: { details: detailsById, loading: loadingById },
  } = useAppSelector((store) => store?.user);

  const mainTabs = [
    {
      id: 1,
      name: "Profile Information",
      icon: "/icons/userIcon.svg",
    },
    {
      id: 2,
      name: "Trasactions",
      icon: "/icons/statement.svg",
    },
    {
      id: 3,
      name: "Activities",
      icon: "/icons/activity.svg",
    },
    {
      id: 4,
      name: "Driving Training & Education",
      icon: "/icons/carIcon.svg",
    },
  ];

  const theme = useTheme();

  return (
    <Fragment>
      <Container maxWidth={false}>
        {/**
         * Renders different components based on the value provided.
         * If value is 0, it renders a SubHeader component with Student Details and two buttons.
         * If value is 1, it renders a SubHeader component with Statements and invoicing and two buttons.
         * If value is 2, it renders a SubHeader component with Activities and Logs and two buttons.
         * If value is not 0, 1, or 2, it renders a SubHeader component with Driver Training & Education and two buttons.
         * @param {number} value - The value to determine which components to render.
         * @returns The JSX elements based on the value provided.
         */}
        {value == 0 ? (
          <SubHeader
            title={"Student Details"}
            subTitle={"Welcome to student profile page"}
          >
            {/* <Button
              variant="contained"
              endIcon={<AddRoundedIcon />}
              sx={{
                backgroundColor: "#C4C4C4",
                borderRadius: "32px",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#C4C4C4",
                },
                marginRight: 2,
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
            </Button> */}
            {""}
          </SubHeader>
        ) : value == 1 ? (
          <SubHeader
            title={"Statements and invoicing"}
            subTitle={"Your payment and subscription details"}
          >
            {/* <Button
              variant="contained"
              startIcon={<img src="/assets/icons/downloadAltIcon.svg" />}
              sx={{
                backgroundColor: theme.palette.common.black,
                borderRadius: "32px",
                color: theme.palette.common.white,
                "&:hover": {
                  backgroundColor: theme.palette.common.black,
                },
                marginRight: 2,
              }}
            >
              Download
            </Button>
            <Button
              endIcon={<AddRoundedIcon />}
              variant="contained"
              sx={{
                backgroundColor: "#5E38B5",
                color: "#fff",
                borderRadius: "32px",
                "&:hover": {
                  backgroundColor: "#5E38B5",
                },
              }}
            >
              Add New Transaction
            </Button> */}
            {""}
          </SubHeader>
        ) : value == 2 ? (
          <SubHeader
            title={"Activities and Logs"}
            subTitle={"Your activities and email logs"}
          >
            {/* <Button
              variant="contained"
              startIcon={<img src="/assets/icons/downloadAltIcon.svg" />}
              sx={{
                backgroundColor: theme.palette.common.black,
                borderRadius: "32px",
                color: theme.palette.common.white,
                "&:hover": {
                  backgroundColor: theme.palette.common.black,
                },
                marginRight: 2,
              }}
            >
              Download
            </Button>
            <Button
              endIcon={<AddRoundedIcon />}
              variant="contained"
              sx={{
                backgroundColor: "#5E38B5",
                color: "#fff",
                borderRadius: "32px",
                "&:hover": {
                  backgroundColor: "#5E38B5",
                },
              }}
            >
              Add New Activity
            </Button> */}
            {""}
          </SubHeader>
        ) : (
          <SubHeader title={"Driver Training & Education"} subTitle={""}>
            <Fragment>
              {/* <Button
                variant="contained"
                endIcon={<AddRoundedIcon />}
                sx={{
                  backgroundColor: "#C4C4C4",
                  borderRadius: "32px",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#C4C4C4",
                  },
                  marginRight: 2,
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
              </Button> */}
              {""}
            </Fragment>
          </SubHeader>
        )}

        <Grid container columnSpacing={4}>
          <Grid sm={3.5} xl={3}>
            {/* User Profile Card */}
            <Box
              sx={{
                padding: "22px 18px",
                backgroundColor: "primary.light",
              }}
            >
              <Stack
                direction={"row"}
                spacing={2}
                justifyContent={"flex-start"}
              >
                <Avatar
                  sx={{
                    height: "72px",
                    width: "72px",
                    textTransform: "uppercase",
                    backgroundColor: "hsla(21, 89%, 58%, 1)",
                  }}
                >
                  {id
                    ? ` ${detailsById?.first_name?.slice(
                        0,
                        1
                      )} ${detailsById?.last_name?.slice(0, 1)} `
                    : user?.first_name?.slice(0, 1) +
                      " " +
                      user?.last_name?.slice(0, 1)}
                </Avatar>
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: "22px",
                      color: "#1E293B",
                      letterSpacing: "-0.8px",
                      lineHeight: "30.14px",
                      paddingTop: "10px",
                    }}
                  >
                    {id
                      ? ` ${detailsById?.first_name} ${detailsById?.last_name} `
                      : user?.first_name + " " + user?.last_name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#7E84A3",
                    }}
                  >
                    {id ? detailsById?.email : user?.email}{" "}
                  </Typography>
                  {user?.is_verified ? (
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      sx={{
                        pt: "20px",
                        pb: "5px",
                      }}
                      spacing={1}
                    >
                      <CheckCircleRoundedIcon color="success" />
                      <Typography>Verified Student</Typography>
                    </Stack>
                  ) : (
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      sx={{
                        pt: "20px",
                        pb: "5px",
                      }}
                      spacing={1}
                    >
                      <CancelRoundedIcon color="error" />
                      <Typography>Unverified Student</Typography>
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Box>

            {/* Profile Tabs */}
            <StyledTabs
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderColor: "divider" }}
            >
              {mainTabs.map((tab, index) => (
                <StyledTab
                  key={tab.id}
                  icon={<img src={tab?.icon} alt={tab.name} />}
                  iconPosition="start"
                  label={
                    <CustomTabLabel>
                      <Typography
                        variant="h5"
                        sx={{
                          fontSize: "19px",
                          color: "#45464E",
                        }}
                      >
                        {tab.name}
                      </Typography>

                      <Box
                        sx={{
                          height: "20px",
                          width: "20px",
                          borderRadius: "50%",
                          border: "2px solid #E0E2E3",
                        }}
                      />
                    </CustomTabLabel>
                  }
                  {...a11yProps(index)}
                />
              ))}
            </StyledTabs>
          </Grid>
          <Grid
            sm={8.5}
            xl={9}
            sx={{
              paddingY: theme.spacing(2),
              backgroundColor: value == 0 ? "primary.light" : "transparent",
            }}
          >
            <TabPanel value={value} index={0}>
              <ProfileInformation />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <TransactionsSection />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <ActivitiesSection />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <TrainingAndEducationSection />
            </TabPanel>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default ClientProfileView;
