import PropTypes from "prop-types";
import React from "react";
import { Button, Modal, Box, Typography, Stack, TextField } from "@mui/material";
import { SeverityPill } from "src/components/severity-pill";
import { customerData } from "src/components/data";
import { ModalStyle } from "src/components/modal-style";

const DetailCustomer = (props) => {
  const { isModalDetailCustomer, setIsModalDetailCustomer, currentId } = props;

  const customer = customerData.find((customer) => customer.id === currentId);

  const statusMap = {
    true: "success",
    false: "error",
  };

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
        <Stack spacing={3} sx={{ mt: 3 }}>
          <TextField fullWidth label="Email" name="email" value={customer?.email} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <TextField
              fullWidth
              label="Tên người dùng"
              name="username"
              value={customer?.username}
            />
            <TextField fullWidth label="Họ và tên" name="full_name" value={customer?.full_name} />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <TextField fullWidth label="Giới tính" name="gender" value={customer?.gender} />
            <TextField fullWidth label="Số điện thoại" name="phone" value={customer?.phone} />
          </Stack>

          <TextField
            fullWidth
            label="Ảnh đại diện"
            name="avatar_url"
            value={customer?.avatar_url}
          />

          <TextField fullWidth label="Địa chỉ" name="address" value={customer?.address} />
          <SeverityPill color={statusMap[customer?.is_verified]}>
            {customer?.is_verified ? "Đã xác thực" : "Chưa xác thực"}
          </SeverityPill>
        </Stack>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleCloseModal} variant="contained" color="inherit">
            Đóng
          </Button>
        </Box>
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
