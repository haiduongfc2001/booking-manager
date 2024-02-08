import PropTypes from "prop-types";
import React from "react";
import { Button, Modal, Box, Typography, Stack, TextField } from "@mui/material";
import { managerData } from "src/components/data";
import { SeverityPill } from "src/components/severity-pill";

const DetailManager = (props) => {
  const { isModalDetailManager, setIsModalDetailManager, currentId } = props;

  const handleCloseModalDetail = () => {
    setIsModalDetailManager(false);
  };

  return (
    <Modal
      open={isModalDetailManager}
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
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={managerData[parseInt(currentId) - 1]?.email}
            />
            <TextField
              fullWidth
              label="Họ và tên"
              name="full_name"
              value={managerData[parseInt(currentId) - 1]?.full_name}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <TextField
              fullWidth
              label="Giới tính"
              name="gender"
              value={managerData[parseInt(currentId) - 1]?.gender}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={managerData[parseInt(currentId) - 1]?.phone}
            />
          </Stack>

          <TextField
            fullWidth
            label="Khách sạn quản lý"
            name="hotel_id"
            value={managerData[parseInt(currentId) - 1]?.hotel_id}
          />

          <TextField
            fullWidth
            label="Ảnh đại diện"
            name="avatar_url"
            value={managerData[parseInt(currentId) - 1]?.avatar_url}
          />
          <SeverityPill color="primary">Quản lý khách sạn</SeverityPill>
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

export default DetailManager;

DetailManager.propTypes = {
  isModalDetailManager: PropTypes.bool.isRequired,
  setIsModalDetailManager: PropTypes.func.isRequired,
  currentId: PropTypes.string.isRequired,
};
