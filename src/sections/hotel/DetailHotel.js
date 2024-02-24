import PropTypes from "prop-types";
import React from "react";
import { Button, Modal, Box, Typography, Stack, TextField } from "@mui/material";
import { hotelData } from "src/components/Data";
import { SeverityPill } from "src/components/SeverityPill";
import { ModalStyle } from "src/components/ModalStyle";

const DetailHotel = (props) => {
  const { isModalDetailHotel, setIsModalDetailHotel, currentId } = props;

  const hotel = hotelData.find((hotel) => hotel.hotel_id === currentId);

  const handleCloseModal = () => {
    setIsModalDetailHotel(false);
  };

  return (
    <Modal
      open={isModalDetailHotel}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalStyle({ width: 50, maxWidth: 55, maxHeight: 85 })}>
        <Typography id="modal-title" variant="h5" component="div">
          Thông tin chi tiết
        </Typography>
        <Stack spacing={3} sx={{ mt: 3 }}>
          <TextField fullWidth label="Tên khách sạn" name="hotel_name" value={hotel?.hotel_name} />
          <TextField fullWidth label="Ảnh" name="image" value={hotel?.image} />
          <TextField fullWidth label="Địa chỉ" name="address" value={hotel?.address} />
          <TextField fullWidth label="Mô tả" name="description" value={hotel?.description} />
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

export default DetailHotel;

DetailHotel.propTypes = {
  isModalDetailHotel: PropTypes.bool.isRequired,
  setIsModalDetailHotel: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
};
