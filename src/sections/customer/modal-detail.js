import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Button, Modal, Box, Typography, Stack, TextField } from "@mui/material";
import { SeverityPill } from "src/components/severity-pill";
import { ModalStyle } from "src/components/modal-style";
import { statusMap } from "src/components/status-map";
import { API, STATUS_CODE } from "src/constant/constants";
import LoadingData from "src/layouts/loading/loading-data";
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

  return (
    <Modal
      open={isModalDetailCustomer}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalStyle({ width: 50, maxWidth: 55, maxHeight: 85 })}>
        <Typography id="modal-title" variant="h5" component="div">
          Thông tin chi tiết
        </Typography>
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
                <TextField fullWidth label="Giới tính" name="gender" value={customerData?.gender} />
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
              <SeverityPill color={statusMap[customerData?.is_verified]}>
                {customerData?.is_verified ? "Đã xác thực" : "Chưa xác thực"}
              </SeverityPill>
            </Stack>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleCloseModal} variant="contained" color="inherit">
                Đóng
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default DetailCustomer;

DetailCustomer.propTypes = {
  isModalDetailCustomer: PropTypes.bool.isRequired,
  setIsModalDetailCustomer: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
};
