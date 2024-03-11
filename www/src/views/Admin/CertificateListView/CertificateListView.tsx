import React, { Fragment } from "react";

// third party libraries
import { Box, Container, SelectChangeEvent } from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import AppointmentListTable from "./components/CertificateListTable";
import { StyledTab, StyledTabs } from "@/components/CustomTabs";
import Image from "next/image";

// ==============================|| USER LIST VIEW ||============================== //
const CertificateListView = () => {
  const [days, setDays] = React.useState("6");

  const handleDaysChange = (event: SelectChangeEvent) => {
    setDays(event.target.value as string);
  };

  const pinkCertificateData = [
    {
      id: 1,
      name: "Jack Murphy",
      email: "amurph66@gmail.com",
      phone: "8058076562",
      birthday: "01-01-2020",
      scheduledhours: "06:00",
      driverTrainingGoldCertificate: null,
      driverTrainingPinkCertificate: null,
      issueDate: "08/02/2020",
      instructor: "Neil Patel",
      number: "",
    },
    {
      id: 2,
      name: "Jack Murphy",
      email: "amurph66@gmail.com",
      phone: "8058076562",
      birthday: "01-01-2020",
      scheduledhours: "06:00",
      driverTrainingGoldCertificate: null,
      driverTrainingPinkCertificate: null,
      issueDate: "08/02/2020",
      instructor: "Neil Patel",
      number: "",
    },
  ];

  const goldCertificateData = [
    {
      id: 1,
      name: "Michael Murphy",
      email: "amurph66@gmail.com",
      phone: "8058076562",
      birthday: "01-01-2020",
      scheduledhours: "06:00",
      driverTrainingGoldCertificate: null,
      driverTrainingPinkCertificate: null,
      issueDate: "08/02/2020",
      instructor: "Neil Patel",
      number: "",
    },
    {
      id: 2,
      name: "Michael Murphy",
      email: "amurph66@gmail.com",
      phone: "8058076562",
      birthday: "01-01-2020",
      scheduledhours: "06:00",
      driverTrainingGoldCertificate: "1xoww",
      driverTrainingPinkCertificate: null,
      issueDate: "08/02/2020",
      instructor: "Neil Patel",
      number: "",
    },
  ];
  const [tabValue, setTabValue] = React.useState<"pink" | "gold" | string>(
    "gold"
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const styles = {
    tabsContainer: {
      width: "597px",
      borderRadius: "24px",
      border: "0px solid rgba(243, 242, 241, 0.80)",
      background: "var(--ffffff, #FFF)",
      filter:
        "drop-shadow(2.477px 2.477px 18.578px rgba(166, 171, 189, 0.50)) drop-shadow(-1.239px -1.239px 16.101px #FAFBFF)",
      display: "flex",
      alignItems: "center",
    },
  };
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: "20px",
        }}
      >
        <Box sx={styles.tabsContainer}>
          <StyledTabs
            variant="fullWidth"
            value={tabValue}
            onChange={handleChange}
            centered
          >
            <StyledTab
              value={"gold"}
              label="Golden Certificate"
              iconPosition="start"
              icon={
                <Image
                  src="/icons/Medallionsgold.svg"
                  alt="Custom Icon"
                  width={"77"}
                  height={"77"}
                  style={{ marginTop: "18px" }}
                />
              }
            />
            <StyledTab
              value={"pink"}
              label="Pink Certificate"
              iconPosition="start"
              icon={
                <Image
                  src="/icons/Medallionspink.svg"
                  alt="Custom Icon"
                  width={"77"}
                  height={"77"}
                  style={{ marginTop: "18px"}}
                />
              }
            />
          </StyledTabs>
        </Box>
      </Box>
      <Container maxWidth={false}>
        <SubHeader days={days} handleDaysChange={handleDaysChange} />
        <Box
          sx={{
            py: 3,
          }}
        >
          <AppointmentListTable
            certificateData={
              tabValue === "pink" ? pinkCertificateData : goldCertificateData
            }
            certificateType={tabValue}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default CertificateListView;
