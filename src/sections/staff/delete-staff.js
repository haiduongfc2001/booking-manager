import React from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as StaffService from "../../services/staff-service";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import PropTypes from "prop-types";

const DeleteStaff = ({
  isModalDeleteStaff,
  setIsModalDeleteStaff,
  hotelId,
  currentId,
  onRefresh,
}) => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setIsModalDeleteStaff(false);
  };

  const handleDelete = async () => {
    try {
      const response = await StaffService[API.STAFF.DELETE_STAFF]({
        hotel_id: String(hotelId).trim(),
        staff_id: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        onRefresh();
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Modal
      open={isModalDeleteStaff}
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
          Xóa tài khoản
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          Bạn có chắc bạn muốn xóa tài khoản này?
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

export default DeleteStaff;

DeleteStaff.propTypes = {
  isModalDeleteStaff: PropTypes.bool.isRequired,
  setIsModalDeleteStaff: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
