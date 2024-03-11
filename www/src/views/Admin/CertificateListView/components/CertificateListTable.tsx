import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  styled,
  TextField as MuiTextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import React from "react";

const CertificateListTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  certificateData = [],
  certificateType = "pink",
}: Props) => {
  interface ColumnType {
    id:
      | "id"
      | "name"
      | "email"
      | "phone"
      | "birthday"
      | "scheduledhours"
      | "driverTrainingGoldCertificate"
      | "driverTrainingPinkCertificate"
      | "issueDate"
      | "instructor"
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
      id: "name",
      label: "Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "email",
      label: "Email",
      minWidth: 170,
      align: "left",
    },
    {
      id: "phone",
      label: "Phone",
      minWidth: 170,
      align: "left",
    },
    {
      id: "birthday",
      label: "Birthday",
      minWidth: 170,
      align: "left",
    },
    {
      id: "scheduledhours",
      label: "Scheduled hours as of 12-18-2023",
      minWidth: 170,
      align: "left",
    },
    {
      id:
        certificateType === "pink"
          ? "driverTrainingPinkCertificate"
          : "driverTrainingGoldCertificate",
      label:
        certificateType === "pink"
          ? "Driver Training (Pink) Certificate #"
          : "Driver Training (Gold) Certificate #",
      minWidth: 170,
      align: "left",
    },
    {
      id: "issueDate",
      label: "Issue Date",
      minWidth: 170,
      align: "left",
    },
    {
      id: "instructor",
      label: "Instructor",
      minWidth: 170,
      align: "left",
    },
    {
      id: "action",
      label: "Action",
      minWidth: 170,
      align: "left",
    },
  ];

  const TextField = styled(MuiTextField)(({ theme }) => ({
    "& .MuiInputBase-root": {
      height: "40px",
      borderRadius: "32px",
      background: "#F6F6F6",
      "& fieldset": {
        border: "1px solid #D7DDE4",
      },
      "& input": {
        padding: "10px 14px",
      },
    },
  }));
  return (
    <React.Fragment>
      <TableContainer
        sx={{
          maxHeight: "697px",
          border: "1px solid #EAECEE",
          borderRadius: "8px",
        }}
      >
        <Table stickyHeader>
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
              {certificateData.map((row, index) => (
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
                    } else {
                      const value = row[column.id];
                      if (
                        column.id === "driverTrainingPinkCertificate" ||
                        column.id === "driverTrainingGoldCertificate"
                      ) {
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            id={column.id}
                          >
                            <TextField value={value} />
                          </TableCell>
                        );
                      }
                      if (column.id === "issueDate") {
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            id={column.id}
                          >
                            {value}
                          </TableCell>
                        );
                      }
                      if (column.id === "instructor") {
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            id={column.id}
                          >
                            <FormControl
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
                                value={value}
                                // onChange={handleSortChange}
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: "dark.main",
                                  fontFamily: (theme) =>
                                    theme.typography.button.fontFamily,
                                  borderRadius: "32px",
                                }}
                              >
                                <MenuItem value="">Choose</MenuItem>
                                <MenuItem value="Neil Patel">
                                  Neil Patel{" "}
                                </MenuItem>
                              </Select>
                            </FormControl>
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
                              variant="contained"
                              sx={{
                                background: "#A4A8BE",
                                borderRadius: "32px",
                                padding: "12px 20px",
                                height: "40px",
                              }}
                            >
                              Submit
                            </Button>
                          </TableCell>
                        );
                      }
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

export default CertificateListTable;

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  certificateData?: any[];
  certificateType?: "pink" | "gold" | string;
}
