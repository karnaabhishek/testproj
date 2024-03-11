import React, { Fragment } from "react";

// third party libraries
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// style + assets
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PersonIcon from "@mui/icons-material/Person";

// project imports
import SubHeader from "./components/SubHeader";
import ActivitiesSection from "./components/Activities";
import TrainingAndEducationSection from "./components/TrainingAndEducation";
import { useSelector } from "react-redux";
import TransactionsSection from "./components/Transactions";

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
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} icon={<PersonIcon />} iconPosition="start" />
))(({ theme }) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#E0E2E3",
  borderRadius: "6px",
  minWidth: "100%",
  minHeight: "66px",
  "&.Mui-selected": {
    borderColor: "#5E38B5",
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// ==============================|| ACCOUNTING VIEW ||============================== //
const AccountingView = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const user = useSelector((state: any) => state.auth?.currentUser?.user);

  const mainTabs = [
    {
      id: 1,
      name: "Transactions",
      icon: "profile",
    },
    {
      id: 2,
      name: "Activities",
      icon: "profile",
    },
    {
      id: 3,
      name: "Driver Training & Education",
      icon: "profile",
    },
  ];

  return (
    <Fragment>
      <Container maxWidth={false}>
        <SubHeader />

        <Stack direction={"row"} spacing={3}>
          <Box>
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
          </Box>
          <Box
            sx={{
              padding: "22px 18px",
              backgroundColor: "primary.light",
              width: "100%",
            }}
          >
            <TabPanel value={value} index={0}>
              {/* <ProfileInformation /> */}
              <TransactionsSection />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ActivitiesSection />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <TrainingAndEducationSection />
            </TabPanel>
          </Box>
        </Stack>
      </Container>
    </Fragment>
  );
};

export default AccountingView;
