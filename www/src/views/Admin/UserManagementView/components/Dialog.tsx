import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

interface Props {
  handleClose: () => void;
  handleAccept: () => void;
  open: boolean;
  dialogTitle?: string;
  children: React.ReactNode;
  isFormikForm?: boolean;
}

export default function CustomDialog({
  handleClose,
  handleAccept,
  open,
  children,
  dialogTitle,
  isFormikForm,
  ...rest
}: Props) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ p: 5 }}>
          {dialogTitle && (
            <DialogTitle
              id="alert-dialog-title"
              sx={{
                fontSize: "1.5rem",
              }}
            >
              {dialogTitle}
            </DialogTitle>
          )}
          <DialogContent sx={{ mt: 2 }}>
            <DialogContentText id="alert-dialog-description">
              {children}
            </DialogContentText>
          </DialogContent>
          {isFormikForm ? null : (
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleAccept} autoFocus>
                Confirm
              </Button>
            </DialogActions>
          )}
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
