import {
  TableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  styled,
  Skeleton,
} from "@mui/material";
import React from "react";

export const StyledTableHead = styled(MuiTableHead)(({ theme }) => ({
  "& .MuiTableRow-root > .MuiTableCell-root": {
    background: "#F4F4F4",
    color: "#4F5B67",
    borderBottom: "none",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  "& .MuiTableCell-root:first-child": {
    borderTopLeftRadius: 8,
  },
}));

export const StyledTableRow = styled(MuiTableRow)(({ theme }) => ({
  "& .MuiTableCell-root": {
    borderBottom: "1px solid #EAECEE",
    fontWeight: 400,
    fontSize: "14px",
  },
  "& #userName": {
    textTransform: "uppercase",
  },
}));

export function TableLoader({ columns }: any) {
  return (
    <StyledTableRow hover>
      {columns &&
        columns?.map((index: any) => (
          <TableCell component="th" scope="row" padding="none" key={index}>
            <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
          </TableCell>
        ))}
    </StyledTableRow>
  );
}
