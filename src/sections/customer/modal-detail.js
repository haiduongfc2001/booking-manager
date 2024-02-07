import PropTypes from "prop-types";
import React from "react";
import { Button, Modal, Box, Typography, Stack, TextField } from "@mui/material";
import { customerData } from "src/components/data";
import { SeverityPill } from "src/components/severity-pill";

const DetailCustomer = (props) => {
  const { isModalDetailCustomer, setIsModalDetailCustomer, currentId } = props;

  const statusMap = {
    true: "success",
    false: "error",
  };

  const handleCloseModalDetail = () => {
    setIsModalDetailCustomer(false);
  };

  return (
    <Modal
      open={isModalDetailCustomer}
      onClose={handleCloseModalDetail}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          maxWidth: "55%",
          maxHeight: "85%",
          overflowY: "auto",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="modal-title" variant="h5" component="div">
          Thông tin chi tiết
        </Typography>
        <Stack spacing={3} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={customerData[parseInt(currentId) - 1]?.email}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <TextField
              fullWidth
              label="Tên người dùng"
              name="username"
              value={customerData[parseInt(currentId) - 1]?.username}
            />
            <TextField
              fullWidth
              label="Họ và tên"
              name="full_name"
              value={customerData[parseInt(currentId) - 1]?.full_name}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <TextField
              fullWidth
              label="Giới tính"
              name="gender"
              value={customerData[parseInt(currentId) - 1]?.gender}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={customerData[parseInt(currentId) - 1]?.phone}
            />
          </Stack>

          <TextField
            fullWidth
            label="Ảnh đại diện"
            name="avatar_url"
            value={customerData[parseInt(currentId) - 1]?.avatar_url}
          />

          <TextField
            fullWidth
            label="Địa chỉ"
            name="address"
            value={customerData[parseInt(currentId) - 1]?.address}
          />
          <SeverityPill color={statusMap[customerData[parseInt(currentId) - 1]?.is_verified]}>
            {customerData[parseInt(currentId) - 1]?.is_verified ? "Đã xác thực" : "Chưa xác thực"}
          </SeverityPill>
        </Stack>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleCloseModalDetail} variant="contained" color="inherit">
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
  currentId: PropTypes.string.isRequired,
};
