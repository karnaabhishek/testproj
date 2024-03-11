import React, { Fragment } from "react";

// third party libraries
import { Box, Container, SelectChangeEvent, Typography } from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import InstructorListTable from "./components/InstructorListTable";
import { fetchUsers } from "@/store/user/user.actions";
import { useDispatch, useSelector } from "react-redux";
import IRootState from "@/store/interface";
import CSRListTable from "./components/CSRListTable";
import InstructorLessonListing from "./components/InstructorLessonListing";
import InstructorsTimesheet from "./components/InstructorsTimesheet";
import { Schedule } from "@mui/icons-material";
import { useAppDispatch } from "@/hooks";

// ==============================|| Instructor LIST VIEW ||============================== //
const InstructorListView = () => {
  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const dispatch = useAppDispatch();
  const { userList, userListLoading } = useSelector(
    (state: IRootState) => state.user
  );
  React.useEffect(() => {
    dispatch(fetchUsers("INSTRUCTOR"));
  }, []);

  const instructorsData = userList?.users
    ? userList?.users?.map((user) => ({
        id: user.id,
        userName: user.email,
        name: user.first_name + " " + user.last_name,
        active: user.is_active,
      }))
    : [
        {
          id: 1,
          userName: "Clairehasanotheremail@gmail.com",
          name: "Pamela Cunnigham",
          active: true,
        },
      ];

  interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const tabs = [
    // {
    //   id: 0,
    //   title: "CSR Users",
    //   subTitle: "List of current CSR on platform",
    // },
    {
      id: 1,
      title: "Current Instructors",
      subTitle: "List of current Instructors on platform",
    },
    {
      id: 2,
      title: "Instructors Lesson Listing",
      subTitle: "Instructor Daily Lesson Listing",
    },
    {
      id: 3,
      title: "Instructors Timesheet",
      subTitle: "Instructor Time Sheet Pay period",
    },
    {
      id: 4,
      title: "Instructors Schedule",
      subTitle: "Instructor  Lesson Schedule",
    },
  ];
  const [tabValue, setTabValue] = React.useState(0);
  return (
    <Fragment>
      <SubHeader
        title={tabs[tabValue].title}
        subTitle={tabs[tabValue].subTitle}
        tabValue={tabValue}
        handleChange={(event, newValue) => setTabValue(Number(newValue))}
        tabs={tabs}
      />
      <Container maxWidth={false}>
        <Box
          sx={{
            py: 3,
          }}
        >
          {/* <TabPanel value={tabValue} index={0}>
            <CSRListTable csrData={instructorsData} />
          </TabPanel> */}
          <TabPanel value={tabValue} index={0}>
            <InstructorListTable instructorsData={instructorsData} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <InstructorLessonListing />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <InstructorsTimesheet />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Schedule />
          </TabPanel>
        </Box>
      </Container>
    </Fragment>
  );
};

export default InstructorListView;
