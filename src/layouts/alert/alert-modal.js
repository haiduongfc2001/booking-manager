import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAlert } from "src/redux/create-actions/alert-action";

const stackStyle = { width: "100%", textAlign: "left" };

export default function AlertModal() {
  const alert = useSelector((state) => state.alert.data);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeAlert());
  };

  const renderAlert = (isOpen) => {
    return isOpen ? (
      <Alert onClose={handleClose} variant="filled" severity={alert.severity}>
        {/* <AlertTitle>{alert.title}</AlertTitle> */}
        {alert.message}
      </Alert>
    ) : (
      <div></div>
    );
  };

  return (
    <Stack sx={stackStyle} spacing={2}>
      <Snackbar
        anchorOrigin={alert.anchorOrigin}
        open={alert.isOpen}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        {renderAlert(alert.isOpen)}
      </Snackbar>
    </Stack>
  );
}
