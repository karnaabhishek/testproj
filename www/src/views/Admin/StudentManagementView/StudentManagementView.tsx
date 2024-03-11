import React, { Fragment } from "react";

// third party libraries
import { Box, Container, SelectChangeEvent } from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import StudentManagementTable from "./components/StudentManagementTable";
import { fetchUsers } from "@/store/user/user.actions";
import { useDispatch, useSelector } from "react-redux";
import IRootState from "@/store/interface";

// ==============================|| STUDENT MANAGEMENT VIEW ||============================== //
const StudentManagementView = () => {
  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const dispatch = useDispatch<any>();
  const { userList, userListLoading } = useSelector(
    (state: IRootState) => state.user
  );
  React.useEffect(() => {
    dispatch(fetchUsers("STUDENT"));
  }, []);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredUsersData = userList?.users
    ? userList.users
        .filter(
          (user) =>
            user.email.includes(searchQuery) ||
            user.first_name.includes(searchQuery) ||
            user.last_name.includes(searchQuery)
        )
        .map((user) => ({
          id: user.id,
          userName: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          school: user.school,
          pinkCert: null,
          goldCert: null,
          loginDate: "12/15/2023",
          createdDate: new Date(user.created_at).toISOString().slice(0, 10),
          transaction: 0,
          certificates: null,
        }))
    : [];

  return (
    <Fragment>
      <SubHeader
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
      />
      <Container maxWidth={false}>
        <Box py={3}>
          <StudentManagementTable usersData={filteredUsersData} />
        </Box>
      </Container>
    </Fragment>
  );
};

export default StudentManagementView;
