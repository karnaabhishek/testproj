import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
} from "@mui/material";
import Image from "next/image";
import React from "react";

const CSRListTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  csrData = [],
}: Props) => {
  interface ColumnType {
    id: "id" | "userName" | "name" | "active" | "action" | "number";
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
      id: "name",
      label: "Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "active",
      label: "Active",
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
              {csrData.map((row, index) => (
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
                    if (column.id === "active") {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          id={column.id}
                        >
                          {value ? "Active" : "Inactive"}
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
                          <IconButton
                            sx={{
                              height: "40px",
                              width: "40px",
                              padding: "0px",
                              backgroundColor: "#F37736",
                              "&:hover": {
                                backgroundColor: "#F37736",
                              },
                              mr: 1,
                            }}
                          >
                            <Image
                              src="/icons/edit.svg"
                              alt="eye"
                              height={16}
                              width={16}
                            />
                          </IconButton>
                          <IconButton
                            sx={{
                              height: "40px",
                              width: "40px",
                              padding: "0px",
                              backgroundColor: "#EB2D2F",
                              "&:hover": {
                                backgroundColor: "red",
                              },
                            }}
                          >
                            <Image
                              src="/icons/delete.svg"
                              alt="eye"
                              height={16}
                              width={16}
                            />
                          </IconButton>
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

export default CSRListTable;

type csr = {
  id: number;
  userName: string;
  name: string;
  active: boolean;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  csrData?: csr[];
}
