import { TOAST_KIND } from "src/constant/constants";
import { showAlert } from "src/redux/create-actions/alert-action";

// Common Toast Message
export const toastMessage = (status, message) => {
  const toastDetails = {
    anchorOrigin: {
      vertical: "top",
      horizontal: "right",
    },
    isOpen: true,
    Title: "",
    severity: "",
    message: message,
  };

  switch (status) {
    case TOAST_KIND.SUCCESS:
      toastDetails.Title = TOAST_KIND.SUCCESS_TITLE;
      toastDetails.severity = TOAST_KIND.SUCCESS_SEVERITY;
      break;
    case TOAST_KIND.ERROR:
      toastDetails.Title = TOAST_KIND.ERROR_TITLE;
      toastDetails.severity = TOAST_KIND.ERROR_SEVERITY;
      break;
    default:
      break;
  }

  return toastDetails;
};

// Common Alert
export const showCommonAlert = (status, message) => {
  const alert = toastMessage(status, message);
  return showAlert(alert);
};
