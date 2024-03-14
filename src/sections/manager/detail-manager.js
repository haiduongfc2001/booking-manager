import PropTypes from "prop-types";
import React from "react";
import { Button, Modal, Box, Typography, Stack, TextField } from "@mui/material";
import { managerData } from "src/components/data";
import { SeverityPill } from "src/components/severity-pill";
import { ModalStyle } from "src/components/modal-style";

const DetailManager = (props) => {
  const { isModalDetailManager, setIsModalDetailManager, currentId } = props;

  const manager = managerData.find((manager) => manager.id === currentId);

  const handleCloseModal = () => {
    setIsModalDetailManager(false);
  };

  return (
    <Modal
      open={isModalDetailManager}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalStyle({ width: 50, maxWidth: 55, maxHeight: 85 })}>
        <Typography id="modal-title" variant="h5" component="div">
          Thông tin chi tiết
        </Typography>
        <Stack spacing={3} sx={{ mt: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <TextField fullWidth label="Email" name="email" value={manager?.email} />
            <TextField fullWidth label="Họ và tên" name="full_name" value={manager?.full_name} />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <TextField fullWidth label="Giới tính" name="gender" value={manager?.gender} />
            <TextField fullWidth label="Số điện thoại" name="phone" value={manager?.phone} />
          </Stack>

          <TextField
            fullWidth
            label="Khách sạn quản lý"
            name="hotel_id"
            value={manager?.hotel_id}
          />

          <TextField fullWidth label="Ảnh đại diện" name="avatar" value={manager?.avatar} />
          <SeverityPill color="primary">Nhân viên khách sạn</SeverityPill>
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

export default DetailManager;

DetailManager.propTypes = {
  isModalDetailManager: PropTypes.bool.isRequired,
  setIsModalDetailManager: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
};
