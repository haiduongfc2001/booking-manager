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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SeverityPill } from "src/components/SeverityPill";
import { StatusMap } from "src/components/StatusMap";
import { API, STATUS_CODE } from "src/constant/Constants";
import LoadingData from "src/layouts/loading/LoadingData";
import * as CustomerService from "../../services/CustomerService";

const DetailCustomer = (props) => {
  const { isModalDetailCustomer, setIsModalDetailCustomer, currentId } = props;

  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await CustomerService[API.CUSTOMER.GET_CUSTOMER_BY_ID]({
        customerId: currentId,
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setCustomerData(response.data);
      } else {
        // dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.FILTER_ERROR));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalDetailCustomer && currentId) {
      fetchData();
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

  const getGenderLabel = (gender) => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  return (
    <Dialog
      open={isModalDetailCustomer}
      onClose={handleCloseModal}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "80vh",
          height: "auto",
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
              <TextField fullWidth label="Email" name="email" value={customerData?.email} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <TextField
                  fullWidth
                  label="Tên người dùng"
                  name="username"
                  value={customerData?.username}
                />
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="full_name"
                  value={customerData?.full_name}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <TextField
                  fullWidth
                  label="Giới tính"
                  name="gender"
                  value={getGenderLabel(customerData?.gender)}
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={customerData?.phone}
                />
              </Stack>

              <TextField
                fullWidth
                label="Ảnh đại diện"
                name="avatar_url"
                value={customerData?.avatar_url}
              />

              <TextField fullWidth label="Địa chỉ" name="address" value={customerData?.address} />
              <SeverityPill color={StatusMap[customerData?.is_verified]}>
                {customerData?.is_verified ? "Đã xác thực" : "Chưa xác thực"}
              </SeverityPill>
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
