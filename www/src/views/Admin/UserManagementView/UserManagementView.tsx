import React, { Fragment } from "react";

// third party libraries
import { Box, Container, SelectChangeEvent } from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import UserListTable from "./components/UserListTable";
import { fetchUsers } from "@/store/user/user.actions";
import { useDispatch, useSelector } from "react-redux";
import IRootState from "@/store/interface";

// ==============================|| USER Management VIEW ||============================== //
const UserManagementView = () => {
  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const dispatch = useDispatch<any>();
  const { userList, userListLoading } = useSelector(
    (state: IRootState) => state.user
  );
  React.useEffect(() => {
    dispatch(fetchUsers("ALL"));
  }, []);

  const usersData = userList?.users
    ? userList.users
        .filter((user) => user.role !== "STUDENT")
        .map((user) => ({
          id: user.id,
          userName: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          loginDate: "12/15/2023",
          role: user.role,
          createdDate: new Date(user.created_at).toISOString().slice(0, 10),
        }))
    : [];
  return (
    <Fragment>
      <SubHeader sortBy={sortBy} handleSortChange={handleSortChange} />
      <Container maxWidth={false} sx={{overflow: "auto"}}>
        <Box
          sx={{
            py: 3,
          }}
        >
          <UserListTable usersData={usersData} />
        </Box>
      </Container>
    </Fragment>
  );
};

export default UserManagementView;
