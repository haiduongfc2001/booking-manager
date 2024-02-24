import React from "react";
import { Button, Modal, Box, Typography } from "@mui/material";

const DeleteHotel = ({ isModalDeleteHotel, setIsModalDeleteHotel, currentId }) => {
  const handleCloseModal = () => {
    setIsModalDeleteHotel(false);
  };

  const handleDelete = () => {
    if (isModalDeleteHotel) console.log("hotel id: ", currentId);
    handleCloseModal();
  };

  return (
    <Modal
      open={isModalDeleteHotel}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "30%",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2.5,
        }}
      >
        <Typography id="modal-title" variant="h5" component="div">
          Xóa khách sạn
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          Bạn có chắc bạn muốn xóa khách sạn này?
        </Typography>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleDelete} sx={{ mr: 2 }} variant="contained" color="error">
            Xóa
          </Button>
          <Button onClick={handleCloseModal} variant="contained" color="inherit">
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteHotel;
