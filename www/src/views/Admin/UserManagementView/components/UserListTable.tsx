import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
} from "@mui/material";
import React from "react";
import CustomDialog from "./Dialog";
import { useDispatch } from "react-redux";
import { updateUserRole } from "@/store/user/user.actions";

const UserListTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  usersData = [],
}: Props) => {
  interface ColumnType {
    id:
      | "id"
      | "userName"
      | "firstName"
      | "lastName"
      | "role"
      | "loginDate"
      | "createdDate"
      | "action"
      | "number";
    label: string;
    minWidth?: number;
    align?: "center" | "right" | "left";
    format?: (value: number) => string;
  }
  const columns: readonly ColumnType[] = [
    {
      id: "number",
      label: "No.",
      minWidth: 30,
      align: "left",
    },
    {
      id: "userName",
      label: "User Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "firstName",
      label: "First Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "lastName",
      label: "Last Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "role",
      label: "Role",
      minWidth: 170,
      align: "left",
    },

    {
      id: "loginDate",
      label: "Login Date",
      minWidth: 170,
      align: "left",
    },
    {
      id: "createdDate",
      label: "Created Date",
      minWidth: 170,
      align: "left",
    },

    // {
    //   id: "action",
    //   label: "Actions",
    //   minWidth: 170,
    //   align: "left",
    // },
  ];

  const dispatch = useDispatch<any>();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<user | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<
    "STUDENT" | "CSR" | "INSTRUCTOR"
  >("STUDENT");
  const handleClickOpen = (user: any) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setSelectedRole("STUDENT");
    setOpenDialog(false);
  };

  const handleAcceptDialog = () => {
    setOpenDialog(false);
    if (selectedUser) {
      dispatch(updateUserRole(selectedUser.id, selectedRole));
    }
  };

  return (
    <React.Fragment>
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle="Update Role"
      >
        <Box>
          <Typography>
            Are you sure you want to update the role of this user?
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedRole}
            label="Age"
            fullWidth
            sx={{ marginTop: "20px" }}
            onChange={(e: any) => setSelectedRole(e.target.value)}
          >
            <MenuItem value={"STUDENT"} disabled>
              STUDENT
            </MenuItem>
            <MenuItem value={"INSTRUCTOR"}>Instructor</MenuItem>
            <MenuItem value={"CSR"}>CSR</MenuItem>
          </Select>
        </Box>
      </CustomDialog>
      <TableContainer
        sx={{
          maxHeight: "697px",
          border: "1px solid #EAECEE",
          borderRadius: "8px",
        }}
      >
        <Table stickyHeader sx={{ minWidth: 750 }}>
          <StyledTableHead>
            <StyledTableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </StyledTableRow>
          </StyledTableHead>

          {loading || isSearching ? (
            <TableBody sx={{ maxHeight: "52px" }}>
              <TableLoader columns={columns} />
            </TableBody>
          ) : (
            <TableBody sx={{ maxHeight: "52px" }}>
              {/* .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
              {usersData.map((row, index) => (
                <StyledTableRow key={index} hover role="checkbox" tabIndex={-1}>
                  {columns.map((column) => {
                    if (column.id === "number") {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          id={column.id}
                        >
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                      );
                    }
                    if (column.id === "action") {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          id={column.id}
                        >
                          <Button
                            onClick={() => handleClickOpen(row)}
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
                            Update Role{" "}
                          </Button>
                        </TableCell>
                      );
                    } else {
                      const value = row[column.id];

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          id={column.id}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value ?? "-"}
                        </TableCell>
                      );
                    }
                  })}
                </StyledTableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default UserListTable;

type user = {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  role: string;
  loginDate: string;
  createdDate: string;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  usersData?: user[];
}
