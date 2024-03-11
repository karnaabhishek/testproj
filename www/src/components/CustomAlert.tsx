import * as React from "react";

// Material-ui
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Project imports
import { useDispatch, useSelector } from "react-redux";
import { closeAlert } from "../store/alert/alert.actions";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Props {
  position?: any;
  alert?: any;
  onCloseAlert?: () => void;
}

// ============================|| CUSTOM ALERT ||============================ //

const CustomAlert = ({
  position = { vertical: "bottom", horizontal: "right" },
}: Props) => {
  const { openAlert, severity, message } = useSelector(
    (state: any) => state.alert
  );

  const dispatch = useDispatch();

  return (
    <Snackbar
      anchorOrigin={position}
      open={openAlert}
      autoHideDuration={5000}
      onClose={() => dispatch(closeAlert())}
      style={{ zIndex: 99999 }}
    >
      <Alert onClose={() => dispatch(closeAlert())} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
