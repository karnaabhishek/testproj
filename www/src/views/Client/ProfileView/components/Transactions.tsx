import React, { Fragment } from "react";

// style + assets
import SearchIcon from "@mui/icons-material/Search";

// third party libraries
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import Link from "next/link";

// ==============================|| SUB HEADER ||============================== //

const Transactions = ({ sortBy, handleSortChange }: any) => {
  const theme = useTheme();
  return (
    <Fragment>
      <Box display={"flex"} gap={"12px"} alignItems={"center"} mb={"21px"}>
        <TextField
          placeholder="Search history"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "32px",
              backgroundColor: theme.palette.common.white,
            },
          }}
        />

        <FormControl
          sx={{
            minWidth: "147px",
          }}
        >
          <InputLabel
            id="filter-by-status-label"
            sx={{
              fontSize: "14px",
              color: "#AFB4B8",
            }}
          >
            Filter by Status
          </InputLabel>
          <Select
            labelId="filter-by-status-label"
            id="demo-simple-select"
            label="Filter by Status"
            value={sortBy}
            onChange={handleSortChange}
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "dark.main",
              borderRadius: "32px",
              backgroundColor: theme.palette.common.white,

              fontFamily: (theme) => theme.typography.button.fontFamily,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.light,
              },
              ".MuiSvgIcon-root ": {
                fill: "#A8B0B9 !important",
              },
            }}
          >
            <MenuItem value="Sort by Date">Sort by date</MenuItem>
            <MenuItem value="Sort by Name">Sort by name</MenuItem>
          </Select>
        </FormControl>

        <DatePicker
          name="select-date"
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "32px",
              backgroundColor: theme.palette.common.white,
            },
          }}
        />

        <Button
          variant="outlined"
          size="large"
          sx={{
            width: "100%",
            borderColor: "secondary.light",
            backgroundColor: theme.palette.common.white,
            padding: "12px 10px",
            fontSize: "14px",
            fontWeight: 500,
            maxWidth: "129px",
            borderRadius: "32px",
            color: "#AFB4B8",
            "&:hover": {
              borderColor: "secondary.light",
              backgroundColor: theme.palette.common.white,
            },
            "&:disabled": {
              backgroundColor: "backgroundColor.main",
              color: "#D6DADE",
            },
          }}
        >
          Clear All Filter
        </Button>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <StyledTableHead>
            <TableRow>
              <TableCell>NO.</TableCell>
              <TableCell align="center">NAME</TableCell>
              <TableCell align="center">AMOUNT</TableCell>
              <TableCell align="center">DISCOUNT AMOUNT</TableCell>
              <TableCell align="center">TRANSACTION TYPE</TableCell>
              <TableCell align="center">METHOD</TableCell>
              <TableCell align="center">LOCATION</TableCell>
              <TableCell align="center">DATE CHARGED</TableCell>
              <TableCell align="center">REFUND</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            <StyledTableRow>
              <TableCell component="th" scope="row">
                1
              </TableCell>
              <TableCell align="center">Jack Murphy</TableCell>
              <TableCell align="center">#12345</TableCell>
              <TableCell align="center">$2345</TableCell>
              <TableCell align="center">
                <Box
                  sx={{
                    border: "1px solid #C2E7B0",
                    fontSize: "12px",
                    fontWeight: 700,
                    lineHeight: "16px",
                    color: "#67C23A",
                    maxWidth: "110px",
                    minWidth: "85px",
                    padding: "4px 10px",
                    margin: "0 auto",
                  }}
                >
                  Purchase
                </Box>
              </TableCell>
              <TableCell align="center">Cash</TableCell>
              <TableCell align="center">Telephone</TableCell>
              <TableCell align="center">12-19-2023</TableCell>
              <TableCell align="center">
                <Link href={"/"}>View</Link>
              </TableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default Transactions;
