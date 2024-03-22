import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMap } from "src/components/status-map";
import { API, STATUS_CODE } from "src/constant/constants";
import LoadingData from "src/layouts/loading/loading-data";
import * as CustomerService from "../../../services/customer-service";
import { getInitials } from "src/utils/get-initials";
import { neutral } from "src/theme/colors";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { getGenderLabel } from "src/utils/get-gender-label";

const DetailCustomer = (props) => {
  const { isModalDetailCustomer, setIsModalDetailCustomer, currentId } = props;

  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCustomer = async () => {
    try {
      setLoading(true);

      const response = await CustomerService[API.CUSTOMER.GET_CUSTOMER_BY_ID]({
        customerId: String(currentId).trim(),
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setCustomerData(response.data);
      } else {
        // dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalDetailCustomer && currentId) {
      getCustomer();
    }
  }, [isModalDetailCustomer, currentId]);

  const handleCloseModal = () => {
    setIsModalDetailCustomer(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalDetailCustomer) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalDetailCustomer]);

  return (
    <Dialog
      open={isModalDetailCustomer}
      onClose={handleCloseModal}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          height: "auto",
          minWidth: "80%",
        },
      }}
    >
      <DialogTitle id="scroll-dialog-title">Thông tin chi tiết</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseModal}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {loading ? (
          <LoadingData />
        ) : (
          <>
            <Stack spacing={3} sx={{ mt: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems={{ xs: "center", sm: "flex-start" }}
              >
                <Avatar
                  src={
                    customerData?.avatar ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
                  }
                  sx={{
                    bgcolor: neutral[300],
                    width: "calc(100% / 3)",
                    height: "auto",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {getInitials(customerData?.full_name)}
                </Avatar>

                <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      autoFocus
                      label="Email"
                      name="email"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ flex: 1 }}
                      value={customerData?.email}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      label="Tên người dùng"
                      name="username"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={customerData?.username}
                    />
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="full_name"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={customerData?.full_name}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      label="Giới tính"
                      name="gender"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={getGenderLabel(customerData?.gender)}
                    />
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={customerData?.phone}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      name="address"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={customerData?.address}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        readOnly
                        label="Ngày sinh"
                        name="dob"
                        value={dayjs(customerData?.dob)}
                      />
                    </LocalizationProvider>
                  </Stack>

                  <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                    <SeverityPill color={StatusMap[customerData?.is_verified]}>
                      {customerData?.is_verified ? "Đã xác thực" : "Chưa xác thực"}
                    </SeverityPill>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="inherit" onClick={handleCloseModal}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailCustomer;

DetailCustomer.propTypes = {
  isModalDetailCustomer: PropTypes.bool.isRequired,
  setIsModalDetailCustomer: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
};
